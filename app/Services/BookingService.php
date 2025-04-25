<?php

namespace App\Services;

use App\Models\Submission;
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


}
