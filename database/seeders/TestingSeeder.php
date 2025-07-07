<?php

namespace Database\Seeders;

use App\Models\Submission;
use App\Models\Testing;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use App\Services\BookingService;

class TestingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bookingService = new BookingService();

        $testings = [
            [
                "submission_id" => 2,
                "status" => "testing",
                "test_date" => Submission::find(2)->test_submission_date,
            ],
            [
                "submission_id" => 5,
                "status" => "testing",
                "test_date" => Submission::find(5)->test_submission_date,
            ],
            [
                "submission_id" => 8,
                "status" => "testing",
                "test_date" => Submission::find(8)->test_submission_date,
            ],
            [
                "submission_id" => 11,
                "status" => "testing",
                "test_date" => Submission::find(11)->test_submission_date,
            ],
            [
                "submission_id" => 14,
                "status" => "testing",
                "test_date" => Submission::find(14)->test_submission_date,
            ],
            [
                "submission_id" => 17,
                "status" => "testing",
                "documents" => ["testing_documents/hasil_uji.pdf"],
                "test_date" => Submission::find(17)->test_submission_date,
                "completed_at" => Carbon::parse(Submission::find(17)->test_submission_date)->addDays(7),
            ],
            [
                "submission_id" => 20,
                "status" => "testing",
                "documents" => ["testing_documents/hasil_uji.pdf"],
                "test_date" => Submission::find(20)->test_submission_date,
                "completed_at" => Carbon::parse(Submission::find(20)->test_submission_date)->addDays(7)
            ],
            [
                "submission_id" => 21,
                "status" => "testing",
                "documents" => ["testing_documents/hasil_uji.pdf"],
                "test_date" => Submission::find(21)->test_submission_date,
                "completed_at" => Carbon::parse(Submission::find(21)->test_submission_date)->addDays(7),
            ],
            [
                "submission_id" => 22,
                "status" => "completed",
                "documents" => ["testing_documents/hasil_uji.pdf"],
                "test_date" => Submission::find(22)->test_submission_date,
                "completed_at" => Carbon::parse(Submission::find(22)->test_submission_date)->addDays(7),
            ],
            [
                "submission_id" => 23,
                "status" => "completed",
                "documents" => ["testing_documents/hasil_uji.pdf"],
                "test_date" => Submission::find(23)->test_submission_date,
                "completed_at" => Carbon::parse(Submission::find(23)->test_submission_date)->addDays(7),
            ],
            [
                "submission_id" => 24,
                "status" => "completed",
                "documents" => ["testing_documents/hasil_uji.pdf"],
                "test_date" => Submission::find(24)->test_submission_date,
                "completed_at" => Carbon::parse(Submission::find(24)->test_submission_date)->addDays(7),
            ],
            [
                "submission_id" => 25,
                "status" => "completed",
                "documents" => ["testing_documents/hasil_uji.pdf"],
                "test_date" => Submission::find(25)->test_submission_date,
                "completed_at" => Carbon::parse(Submission::find(25)->test_submission_date)->addDays(7),
            ],
            [
                "submission_id" => 26,
                "status" => "testing",
                "test_date" => Submission::find(26)->test_submission_date,
            ],
            [
                "submission_id" => 27,
                "status" => "completed",
                "documents" => ["testing_documents/hasil_uji.pdf"],
                "test_date" => Submission::find(27)->test_submission_date,
                "completed_at" => Carbon::parse(Submission::find(27)->test_submission_date)->addDays(7),
            ],
            [
                "submission_id" => 32,
                "status" => "testing",
                "test_date" => Submission::find(32)->test_submission_date,
            ],
            [
                "submission_id" => 35,
                "status" => "completed",
                "documents" => ["testing_documents/hasil_uji.pdf"],
                "test_date" => Submission::find(35)->test_submission_date,
                "completed_at" => Carbon::parse(Submission::find(35)->test_submission_date)->addDays(7),
            ],
            [
                "submission_id" => 37,
                "status" => "completed",
                "documents" => ["testing_documents/hasil_uji.pdf"],
                "test_date" => Submission::find(37)->test_submission_date,
                "completed_at" => Carbon::parse(Submission::find(37)->test_submission_date)->addDays(7),
            ],
            [
                "submission_id" => 40,
                "status" => "testing",
                "test_date" => Submission::find(40)->test_submission_date,
            ],
            [
                "submission_id" => 42,
                "status" => "completed",
                "test_date" => Submission::find(42)->test_submission_date,
            ],
            [
                "submission_id" => 45,
                "status" => "testing",
                "test_date" => Submission::find(45)->test_submission_date,
            ],
        ];

        foreach ($testings as $testing) {
            $created_testing =  Testing::create($testing);

            $bookingService->storeScheduleTesting($created_testing->id);
        }


    }
}
