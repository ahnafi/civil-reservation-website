<?php

namespace App\Services;

use App\Models\Testing;
use App\Models\Schedule;
use App\Models\Submission;
use App\Models\Package;
use App\Models\Test;
use App\Models\ScheduleTesting;
use Illuminate\Support\Facades\DB;
class BookingUtils
{
    public static function getTestIdsFromTesting($testing_id): array
    {
        $testing = Testing::findOrFail($testing_id);

        $testIds = DB::table('submission_test')
            ->where('submission_id', $testing->submission_id)
            ->pluck('test_id');

        $packageIds = DB::table('submission_package')
            ->where('submission_id', $testing->submission_id)
            ->pluck('package_id');

        $packageTestIds = DB::table('package_test')
            ->whereIn('package_id', $packageIds)
            ->pluck('test_id');

        return $testIds
            ->merge($packageTestIds)
            ->toArray();
    }

    public static function handleScheduleForTesting($testing_id, array $testIds)
    {
        $testing = Testing::findOrFail($testing_id);
        $date = $testing->test_date;

        foreach ($testIds as $test_id) {
            $schedule = self::getScheduleForTestAndDate($test_id, $date);

            if ($schedule) {
                self::handleExistingSchedule($schedule, $testing_id);
            } else {
                self::createNewSchedule($test_id, $date, $testing_id);
            }
        }
    }

    protected static function getScheduleForTestAndDate($test_id, $date)
    {
        // return DB::table('schedules')
        //     ->where('test_id', $test_id)
        //     ->where('date', $date)
        //     ->first();

        return Schedule::query()
            ->where('test_id', $test_id)
            ->whereDate('date', $date)
            ->first();
    }

    protected static function handleExistingSchedule($schedule, $testing_id)
    {
        if ($schedule->available_slots > 0) {
            self::createScheduleTesting($schedule, $testing_id);

            $schedule->available_slots -= 1;
            $schedule->save();
        } else {
            return response()->json([
                'message' => 'Slot tidak tersedia untuk jadwal ini',
            ], 400);
        }
    }

    protected static function createNewSchedule($test_id, $date, $testing_id)
    {
        $schedule = new Schedule();
        $schedule->test_id = $test_id;
        $schedule->date = $date;

        $schedule->available_slots = $schedule->test->daily_slot;
        $schedule->save();

        self::createScheduleTesting($schedule, $testing_id);

        $schedule->available_slots -= 1;
        $schedule->save();
    }

    protected static function createScheduleTesting($schedule, $testing_id)
    {
        $scheduleTesting = new ScheduleTesting();
        $scheduleTesting->testing_id = $testing_id;
        $scheduleTesting->schedule_id = $schedule->id;
        $scheduleTesting->save();
    }
}
