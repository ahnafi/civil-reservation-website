<?php

namespace App\Services;

use App\Models\Submission;
use Filament\Notifications\Notification;
use Illuminate\Database\Eloquent\Model;
use Laravel\Pennant\Feature;

class BookingService
{
    public function createSubmission(
        $user_id,
        $company_name,
        $project_name,
        $project_address,
        $total_cost,
        $test_submission_date,
        array $submission_tests,
        array $submission_packages
    ) {
        $submission = new Submission();
        $submission->user_id = $user_id;
        $submission->company_name = $company_name;
        $submission->project_name = $project_name;
        $submission->project_address = $project_address;
        $submission->total_cost = $total_cost;
        $submission->test_submission_date = $test_submission_date;
        $submission->save();

        foreach ($submission_tests as $test) {
            $submission->tests()->attach($test['test_id'], ['quantity' => $test['quantity']]);
        }

        $submission->packages()->attach($submission_packages);
    }

    public function recreateSubmission(Model $record)
    {
        // Step 1: Duplikasi data utama submission
        $submission = Submission::create([
            "user_id" => $record->user_id,
            "company_name" => $record->company_name,
            "project_name" => $record->project_name,
            "project_address" => $record->project_address,
            "total_cost" => $record->total_cost,
            "document" => $record->document,
            "test_submission_date" => $record->test_submission_date,
            "status" => "approved",
            "note" => $record->note,
            "approval_date" => now()
        ]);

        // // Step 2: Duplikasi relasi tests (dengan pivot "quantity")
        if ($record->relationLoaded('tests') || method_exists($record, 'tests')) {
            $testData = [];
            foreach ($record->tests as $test) {
            $testData[$test->id] = ['quantity' => $test->pivot->quantity];
            }
            $submission->tests()->attach($testData);
        }

        // Step 3: Duplikasi relasi packages (tanpa pivot tambahan)
        if ($record->relationLoaded('packages') || method_exists($record, 'packages')) {
            $submission->packages()->attach(
            $record->packages->pluck('id')->toArray()
            );
        }

        // Step 4: Opsional - notifikasi atau email
        Notification::make()
            ->title('Pengajuan ulang')
            ->body('Data submission berhasil diajukan ulang.')
            ->success()
            ->send();

        return redirect()->route('filament.admin.resources.submissions.edit', $submission->id);
    }


}
