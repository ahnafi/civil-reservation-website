<?php

namespace Database\Seeders;

use App\Models\Submission;
use App\Models\Testing;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class TestingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $testings = [
            [
                "submission_id" => 5,
                "status" => "testing",
                "test_date" => Submission::find(5)->test_submission_date,
            ],
            [
                "submission_id" => 14,
                "status" => "testing",
                "test_date" => Submission::find(14)->test_submission_date,
            ],
            [
                "submission_id" => 20,
                "status" => "testing",
                "test_date" => Submission::find(20)->test_submission_date,
            ],
            [
                "submission_id" => 21,
                "status" => "testing",
                "test_date" => Submission::find(21)->test_submission_date,
            ],
            [
                "submission_id" => 27,
                "status" => "testing",
                "test_date" => Submission::find(27)->test_submission_date,
            ],
            [
                "submission_id" => 28,
                "status" => "completed",
                "documents" => "hasil_uji.pdf",
                "test_date" => Submission::find(28)->test_submission_date,
                "completed_at" => Carbon::parse(Submission::find(28)->test_submission_date)->addDays(7),
            ],
            [
                "submission_id" => 29,
                "status" => "completed",
                "documents" => "hasil_uji.pdf",
                "test_date" => Submission::find(29)->test_submission_date,
                "completed_at" => Carbon::parse(Submission::find(29)->test_submission_date)->addDays(7)
            ],
            [
                "submission_id" => 30,
                "status" => "completed",
                "documents" => "hasil_uji.pdf",
                "test_date" => Submission::find(30)->test_submission_date,
                "completed_at" => Carbon::parse(Submission::find(30)->test_submission_date)->addDays(7),
            ],
            [
                "submission_id" => 31,
                "status" => "completed",
                "documents" => "hasil_uji.pdf",
                "test_date" => Submission::find(31)->test_submission_date,
                "completed_at" => Carbon::parse(Submission::find(31)->test_submission_date)->addDays(7),
            ],
            [
                "submission_id" => 36,
                "status" => "completed",
                "documents" => "hasil_uji.pdf",
                "test_date" => Submission::find(36)->test_submission_date,
                "completed_at" => Carbon::parse(Submission::find(36)->test_submission_date)->addDays(7),
            ],
            [
                "submission_id" => 37,
                "status" => "completed",
                "documents" => "hasil_uji.pdf",
                "test_date" => Submission::find(37)->test_submission_date,
                "completed_at" => Carbon::parse(Submission::find(37)->test_submission_date)->addDays(7),
            ],
            [
                "submission_id" => 38,
                "status" => "completed",
                "documents" => "hasil_uji.pdf",
                "test_date" => Submission::find(38)->test_submission_date,
                "completed_at" => Carbon::parse(Submission::find(38)->test_submission_date)->addDays(7),
            ],
            [
                "submission_id" => 39,
                "status" => "completed",
                "documents" => "hasil_uji.pdf",
                "test_date" => Submission::find(39)->test_submission_date,
                "completed_at" => Carbon::parse(Submission::find(39)->test_submission_date)->addDays(7),
            ]
        ];

        foreach ($testings as $testing) {
            Testing::create($testing);
        }


    }
}
