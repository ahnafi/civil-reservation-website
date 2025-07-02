<?php

namespace App\Services;

use App\Models\Testing;
use App\Models\Schedule;
use App\Exceptions\SlotUnavailableException;
use App\Models\Submission;
use App\Models\Package;
use App\Models\Test;
use App\Models\ScheduleTesting;
use Illuminate\Support\Facades\DB;
class BookingUtils
{
    public static function getTestIdsFromTesting(int $testing_id): array
    {
        $testing = Testing::with('submission.submissionPackages.package.tests', 'submission.submissionTests')->findOrFail($testing_id);
        $submission = $testing->submission;

        $directTestIds = $submission->submissionTests->pluck('test_id');

        $packageTestIds = $submission->submissionPackages
            ->pluck('package')
            ->flatMap(fn($package) => $package->tests->pluck('id'));

        return $directTestIds
            ->merge($packageTestIds)
            ->unique()
            ->values()
            ->toArray();
    }

    public static function handleScheduleForTesting(int $testing_id, array $testIds): void
    {
        DB::transaction(function () use ($testing_id, $testIds) {
            $testing = Testing::findOrFail($testing_id);
            $date = $testing->test_date;

            foreach ($testIds as $test_id) {
                $schedule = self::getScheduleForTestAndDate($test_id, $date);

                if ($schedule) {
                    self::assignToExistingSchedule($schedule, $testing_id);
                } else {
                    self::createAndAssignNewSchedule($test_id, $date, $testing_id);
                }
            }
        });
    }

    protected static function getScheduleForTestAndDate(int $test_id, string $date):  ?Schedule
    {
        return Schedule::where('test_id', $test_id)
            ->whereDate('date', $date)
            ->first();
    }

    protected static function assignToExistingSchedule(Schedule $schedule, int  $testing_id)
    {
        if ($schedule->available_slots > 0) {
            self::createScheduleTesting($schedule, $testing_id);

            $schedule->decrement('available_slots');
        } else {
            throw new SlotUnavailableException();
        }
    }

    protected static function createAndAssignNewSchedule(int $test_id, string $date, int $testing_id): void
    {
        $test = Test::findOrFail($test_id);

        $schedule = new Schedule([
            'test_id' => $test_id,
            'date' => $date,
            'available_slots' => $test->daily_slot,
        ]);
        $schedule->save();

        self::createScheduleTesting($schedule, $testing_id);
        $schedule->decrement('available_slots');
    }

    protected static function createScheduleTesting(Schedule $schedule, int $testing_id): void
    {
        ScheduleTesting::create([
            'testing_id' => $testing_id,
            'schedule_id' => $schedule->id,
        ]);
    }
}
