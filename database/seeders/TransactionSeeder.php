<?php

namespace Database\Seeders;

use App\Models\Transaction;
use App\Models\Submission;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {


        $transactions = [
            [
                "submission_id" => 2,
                "status" => "pending",
                "amount" => Submission::find(2)?->submissionExternalDetail?->total_cost??0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf"],
            ],
            [
                "submission_id" => 5,
                "status" => "success",
                "amount" => Submission::find(5)?->submissionExternalDetail?->total_cost??0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf"],
                "payment_receipt_images" => ["payment_receipt_images/bukti_bayar.jpeg"],
                "payment_method" => "BANK JATENG",
                "payment_date" => now(),
            ], // 2 success 5
            [
                "submission_id" => 8,
                "status" => "failed",
                "amount" => Submission::find(8)?->submissionExternalDetail?->total_cost??0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf"],
            ],
            [
                "submission_id" => 11,
                "status" => "pending",
                "amount" => Submission::find(11)?->submissionExternalDetail?->total_cost??0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf"],
            ],
            [
                "submission_id" => 14,
                "status" => "success",
                "amount" => Submission::find(14)?->submissionExternalDetail?->total_cost??0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf"],
                "payment_receipt_images" => ["payment_receipt_images/bukti_bayar.jpeg"],
                "payment_method" => "BANK MANDIRI",
                "payment_date" => now(),
            ], // 5 success 14
            [
                "submission_id" => 17,
                "status" => "failed",
                "amount" => Submission::find(17)?->submissionExternalDetail?->total_cost??0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf"],
            ],
            [
                "submission_id" => 20,
                "status" => "success",
                "amount" => Submission::find(20)?->submissionExternalDetail?->total_cost??0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf"],
                "payment_receipt_images" => ["payment_receipt_images/bukti_bayar.jpeg"],
                "payment_method" => "BANK BNI",
                "payment_date" => now(),
            ], // 7 success 20
            [
                "submission_id" => 21,
                "status" => "success",
                "amount" => Submission::find(21)?->submissionExternalDetail?->total_cost??0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf"],
                "payment_receipt_images" => ["payment_receipt_images/bukti_bayar.jpeg"],
                "payment_method" => "BANK BRI",
                "payment_date" => now(),
            ], // 8 success 21
            [
                "submission_id" => 22,
                "status" => "failed",
                "amount" => Submission::find(22)?->submissionExternalDetail?->total_cost??0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf"],
            ],
            [
                "submission_id" => 23,
                "status" => "failed",
                "amount" => Submission::find(23)?->submissionExternalDetail?->total_cost??0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf"],
            ],
            [
                "submission_id" => 24,
                "status" => "failed",
                "amount" => Submission::find(24)?->submissionExternalDetail?->total_cost??0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf"],
            ],
            [
                "submission_id" => 25,
                "status" => "failed",
                "amount" => Submission::find(25)?->submissionExternalDetail?->total_cost??0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf"],
            ],
        ];

        foreach ($transactions as $transaction) {
            Transaction::create($transaction);
        }
    }
}
