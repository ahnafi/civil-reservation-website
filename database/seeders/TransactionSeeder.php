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
                "amount" => Submission::find(2)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
            ],
            [
                "submission_id" => 5,
                "status" => "success",
                "amount" => Submission::find(5)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
                "payment_receipt_image" => "bukti_bayar.jpg",
                "payment_method" => "BANK JATENG",
                "payment_date" => now(),
            ], // 2 success 5
            [
                "submission_id" => 8,
                "status" => "failed",
                "amount" => Submission::find(8)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
            ],
            [
                "submission_id" => 11,
                "status" => "pending",
                "amount" => Submission::find(11)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
            ],
            [
                "submission_id" => 14,
                "status" => "success",
                "amount" => Submission::find(14)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
                "payment_receipt_image" => "bukti_bayar.jpg",
                "payment_method" => "BANK MANDIRI",
                "payment_date" => now(),
            ], // 5 success 14
            [
                "submission_id" => 17,
                "status" => "failed",
                "amount" => Submission::find(17)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
            ],
            [
                "submission_id" => 20,
                "status" => "success",
                "amount" => Submission::find(20)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
                "payment_receipt_image" => "bukti_bayar.jpg",
                "payment_method" => "BANK BNI",
                "payment_date" => now(),
            ], // 7 success 20
            [
                "submission_id" => 21,
                "status" => "success",
                "amount" => Submission::find(21)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
                "payment_receipt_image" => "bukti_bayar.jpg",
                "payment_method" => "BANK BRI",
                "payment_date" => now(),
            ], // 8 success 21
            [
                "submission_id" => 22,
                "status" => "failed",
                "amount" => Submission::find(22)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
            ],
            [
                "submission_id" => 23,
                "status" => "failed",
                "amount" => Submission::find(23)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
            ],
            [
                "submission_id" => 24,
                "status" => "failed",
                "amount" => Submission::find(24)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
            ],
            [
                "submission_id" => 25,
                "status" => "failed",
                "amount" => Submission::find(25)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
            ],
            [
                "submission_id" => 26,
                "status" => "failed",
                "amount" => Submission::find(26)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
            ],
            [
                "submission_id" => 27,
                "status" => "success",
                "amount" => Submission::find(27)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
                "payment_receipt_image" => "bukti_bayar.jpg",
                "payment_method" => "BANK BRI",
                "payment_date" => now(),
            ], // 14 success 27
            [
                "submission_id" => 28,
                "status" => "success",
                "amount" => Submission::find(28)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
                "payment_receipt_image" => "bukti_bayar.jpg",
                "payment_method" => "BANK BSI",
                "payment_date" => now(),
            ], // 15 success 28
            [
                "submission_id" => 29,
                "status" => "success",
                "amount" => Submission::find(29)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
                "payment_receipt_image" => "bukti_bayar.jpg",
                "payment_method" => "BANK BTN",
                "payment_date" => now(),
            ], // 16 success 29
            [
                "submission_id" => 30,
                "status" => "success",
                "amount" => Submission::find(30)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
                "payment_receipt_image" => "bukti_bayar.jpg",
                "payment_method" => "BANK JATENG",
                "payment_date" => now(),
            ], // 17 success 30
            [
                "submission_id" => 31,
                "status" => "success",
                "amount" => Submission::find(31)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
                "payment_receipt_image" => "bukti_bayar.jpg",
                "payment_method" => "BANK MANDIRI",
                "payment_date" => now(),
            ], // 18 success 31
            [
                "submission_id" => 36,
                "status" => "success",
                "amount" => Submission::find(36)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
                "payment_receipt_image" => "bukti_bayar.jpg",
                "payment_method" => "BANK BNI",
                "payment_date" => now(),
            ], // 19 success 36
            [
                "submission_id" => 37,
                "status" => "success",
                "amount" => Submission::find(37)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
                "payment_receipt_image" => "bukti_bayar.jpg",
                "payment_method" => "BANK BRI",
                "payment_date" => now(),
            ], // 20 success 37
            [
                "submission_id" => 38,
                "status" => "success",
                "amount" => Submission::find(38)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
                "payment_receipt_image" => "bukti_bayar.jpg",
                "payment_method" => "BANK BSI",
                "payment_date" => now(),
            ], // 21 success 38
            [
                "submission_id" => 39,
                "status" => "success",
                "amount" => Submission::find(39)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
                "payment_receipt_image" => "bukti_bayar.jpg",
                "payment_method" => "BANK BTN",
                "payment_date" => now(),
            ], // 22 success 39
            [
                "submission_id" => 40,
                "status" => "pending",
                "amount" => Submission::find(40)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
            ],
            [
                "submission_id" => 41,
                "status" => "pending",
                "amount" => Submission::find(41)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
            ],
            [
                "submission_id" => 42,
                "status" => "pending",
                "amount" => Submission::find(42)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
            ],
            [
                "submission_id" => 43,
                "status" => "pending",
                "amount" => Submission::find(43)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
            ],
            [
                "submission_id" => 44,
                "status" => "pending",
                "amount" => Submission::find(44)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
            ],
            [
                "submission_id" => 45,
                "status" => "pending",
                "amount" => Submission::find(45)->total_cost,
                "payment_invoice_file" => "invoice.pdf",
            ],
        ];

        foreach ($transactions as $transaction) {
            Transaction::create($transaction);
        }
    }
}
