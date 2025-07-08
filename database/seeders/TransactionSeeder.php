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
            // Submission ID 2 - Main payment (pending)
            [
                "submission_id" => 2,
                "payment_type" => "main",
                "status" => "pending",
                "amount" => Submission::find(2)?->submissionExternalDetail?->total_cost ?? 0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf", "payment_invoice_files/invoice1.pdf", "payment_invoice_files/invoice2.pdf"],
                "payment_deadline" => now()->addDays(7),
            ],
            // Submission ID 2 - Additional payment (pending)
            [
                "submission_id" => 2,
                "payment_type" => "additional",
                "status" => "pending",
                "amount" => 150000,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf"],
                "payment_deadline" => now()->addDays(5),
                "note" => "Biaya tambahan untuk pengujian khusus",
            ],

            // Submission ID 5 - Main payment (success)
            [
                "submission_id" => 5,
                "payment_type" => "main",
                "status" => "success",
                "amount" => Submission::find(5)?->submissionExternalDetail?->total_cost ?? 0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf", "payment_invoice_files/invoice1.pdf", "payment_invoice_files/invoice2.pdf"],
                "payment_receipt_images" => ["payment_receipt_images/bukti_bayar.jpeg"],
                "payment_method" => "BANK JATENG",
                "payment_date" => now()->subDays(2),
                "payment_deadline" => now()->subDays(5),
            ],
            // Submission ID 5 - Additional payment (success)
            [
                "submission_id" => 5,
                "payment_type" => "additional",
                "status" => "success",
                "amount" => 200000,
                "payment_invoice_files" => ["payment_invoice_files/invoice1.pdf"],
                "payment_receipt_images" => ["payment_receipt_images/bukti_bayar.jpeg"],
                "payment_method" => "BANK BNI SIPIL",
                "payment_date" => now()->subDays(1),
                "payment_deadline" => now()->subDays(3),
                "note" => "Pembayaran tambahan untuk layanan ekspres",
            ],

            // Submission ID 8 - Main payment (failed)
            [
                "submission_id" => 8,
                "payment_type" => "main",
                "status" => "failed",
                "amount" => Submission::find(8)?->submissionExternalDetail?->total_cost ?? 0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf", "payment_invoice_files/invoice1.pdf", "payment_invoice_files/invoice2.pdf"],
                "payment_deadline" => now()->subDays(1),
            ],
            // Submission ID 8 - Additional payment (pending)
            [
                "submission_id" => 8,
                "payment_type" => "additional",
                "status" => "pending",
                "amount" => 100000,
                "payment_invoice_files" => ["payment_invoice_files/invoice2.pdf"],
                "payment_deadline" => now()->addDays(3),
                "note" => "Biaya tambahan untuk pengujian ulang",
            ],

            // Submission ID 11 - Main payment (pending)
            [
                "submission_id" => 11,
                "payment_type" => "main",
                "status" => "pending",
                "amount" => Submission::find(11)?->submissionExternalDetail?->total_cost ?? 0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf", "payment_invoice_files/invoice1.pdf", "payment_invoice_files/invoice2.pdf"],
                "payment_deadline" => now()->addDays(5),
            ],
            // Submission ID 11 - Additional payment (failed)
            [
                "submission_id" => 11,
                "payment_type" => "additional",
                "status" => "failed",
                "amount" => 75000,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf"],
                "payment_deadline" => now()->subDays(2),
                "note" => "Biaya administrasi tambahan",
            ],

            // Submission ID 14 - Main payment (success)
            [
                "submission_id" => 14,
                "payment_type" => "main",
                "status" => "success",
                "amount" => Submission::find(14)?->submissionExternalDetail?->total_cost ?? 0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf", "payment_invoice_files/invoice1.pdf", "payment_invoice_files/invoice2.pdf"],
                "payment_receipt_images" => ["payment_receipt_images/bukti_bayar.jpeg"],
                "payment_method" => "BANK MANDIRI",
                "payment_date" => now()->subDays(1),
                "payment_deadline" => now()->subDays(3),
            ],
            // Submission ID 14 - Additional payment (success)
            [
                "submission_id" => 14,
                "payment_type" => "additional",
                "status" => "success",
                "amount" => 180000,
                "payment_invoice_files" => ["payment_invoice_files/invoice1.pdf"],
                "payment_receipt_images" => ["payment_receipt_images/bukti_bayar.jpeg"],
                "payment_method" => "BANK BNI SIPIL",
                "payment_date" => now(),
                "payment_deadline" => now()->addDays(2),
                "note" => "Pembayaran tambahan untuk sertifikat khusus",
            ],

            // Submission ID 17 - Main payment (failed)
            [
                "submission_id" => 17,
                "payment_type" => "main",
                "status" => "failed",
                "amount" => Submission::find(17)?->submissionExternalDetail?->total_cost ?? 0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf", "payment_invoice_files/invoice1.pdf", "payment_invoice_files/invoice2.pdf"],
                "payment_deadline" => now()->subDays(2),
            ],
            // Submission ID 17 - Additional payment (pending)
            [
                "submission_id" => 17,
                "payment_type" => "additional",
                "status" => "pending",
                "amount" => 120000,
                "payment_invoice_files" => ["payment_invoice_files/invoice2.pdf"],
                "payment_deadline" => now()->addDays(4),
                "note" => "Biaya tambahan untuk konsultasi teknis",
            ],

            // Submission ID 20 - Main payment (success)
            [
                "submission_id" => 20,
                "payment_type" => "main",
                "status" => "success",
                "amount" => Submission::find(20)?->submissionExternalDetail?->total_cost ?? 0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf", "payment_invoice_files/invoice1.pdf", "payment_invoice_files/invoice2.pdf"],
                "payment_receipt_images" => ["payment_receipt_images/bukti_bayar.jpeg"],
                "payment_method" => "BANK BNI",
                "payment_date" => now()->subDays(3),
                "payment_deadline" => now()->subDays(5),
            ],
            // Submission ID 20 - Additional payment (success)
            [
                "submission_id" => 20,
                "payment_type" => "additional",
                "status" => "success",
                "amount" => 90000,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf"],
                "payment_receipt_images" => ["payment_receipt_images/bukti_bayar.jpeg"],
                "payment_method" => "BANK BNI SIPIL",
                "payment_date" => now()->subDays(1),
                "payment_deadline" => now()->addDays(1),
                "note" => "Biaya tambahan untuk pengujian material khusus",
            ],

            // Submission ID 21 - Main payment (success)
            [
                "submission_id" => 21,
                "payment_type" => "main",
                "status" => "success",
                "amount" => Submission::find(21)?->submissionExternalDetail?->total_cost ?? 0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf", "payment_invoice_files/invoice1.pdf", "payment_invoice_files/invoice2.pdf"],
                "payment_receipt_images" => ["payment_receipt_images/bukti_bayar.jpeg"],
                "payment_method" => "BANK BRI",
                "payment_date" => now()->subDays(1),
                "payment_deadline" => now()->subDays(4),
            ],
            // Submission ID 21 - Additional payment (pending)
            [
                "submission_id" => 21,
                "payment_type" => "additional",
                "status" => "pending",
                "amount" => 65000,
                "payment_invoice_files" => ["payment_invoice_files/invoice1.pdf"],
                "payment_deadline" => now()->addDays(6),
                "note" => "Biaya sertifikat tambahan",
            ],

            // Submission ID 22 - Main payment (failed)
            [
                "submission_id" => 22,
                "payment_type" => "main",
                "status" => "failed",
                "amount" => Submission::find(22)?->submissionExternalDetail?->total_cost ?? 0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf", "payment_invoice_files/invoice1.pdf", "payment_invoice_files/invoice2.pdf"],
                "payment_deadline" => now()->subDays(1),
            ],
            // Submission ID 22 - Additional payment (failed)
            [
                "submission_id" => 22,
                "payment_type" => "additional",
                "status" => "failed",
                "amount" => 110000,
                "payment_invoice_files" => ["payment_invoice_files/invoice2.pdf"],
                "payment_deadline" => now()->subDays(3),
                "note" => "Biaya tambahan untuk analisis lanjutan",
            ],

            // Submission ID 23 - Main payment (failed)
            [
                "submission_id" => 23,
                "payment_type" => "main",
                "status" => "failed",
                "amount" => Submission::find(23)?->submissionExternalDetail?->total_cost ?? 0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf", "payment_invoice_files/invoice1.pdf", "payment_invoice_files/invoice2.pdf"],
                "payment_deadline" => now()->subDays(3),
            ],
            // Submission ID 23 - Additional payment (success)
            [
                "submission_id" => 23,
                "payment_type" => "additional",
                "status" => "success",
                "amount" => 85000,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf"],
                "payment_receipt_images" => ["payment_receipt_images/bukti_bayar.jpeg"],
                "payment_method" => "BANK BNI SIPIL",
                "payment_date" => now()->subHours(12),
                "payment_deadline" => now()->addDays(1),
                "note" => "Pembayaran untuk layanan konsultasi",
            ],

            // Submission ID 24 - Main payment (failed)
            [
                "submission_id" => 24,
                "payment_type" => "main",
                "status" => "failed",
                "amount" => Submission::find(24)?->submissionExternalDetail?->total_cost ?? 0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf", "payment_invoice_files/invoice1.pdf", "payment_invoice_files/invoice2.pdf"],
                "payment_deadline" => now()->subDays(2),
            ],
            // Submission ID 24 - Additional payment (pending)
            [
                "submission_id" => 24,
                "payment_type" => "additional",
                "status" => "pending",
                "amount" => 125000,
                "payment_invoice_files" => ["payment_invoice_files/invoice1.pdf"],
                "payment_deadline" => now()->addDays(7),
                "note" => "Biaya tambahan untuk pengujian khusus material",
            ],

            // Submission ID 25 - Main payment (failed)
            [
                "submission_id" => 25,
                "payment_type" => "main",
                "status" => "failed",
                "amount" => Submission::find(25)?->submissionExternalDetail?->total_cost ?? 0,
                "payment_invoice_files" => ["payment_invoice_files/invoice.pdf", "payment_invoice_files/invoice1.pdf", "payment_invoice_files/invoice2.pdf"],
                "payment_deadline" => now()->subDays(4),
            ],
            // Submission ID 25 - Additional payment (success)
            [
                "submission_id" => 25,
                "payment_type" => "additional",
                "status" => "success",
                "amount" => 95000,
                "payment_invoice_files" => ["payment_invoice_files/invoice2.pdf"],
                "payment_receipt_images" => ["payment_receipt_images/bukti_bayar.jpeg"],
                "payment_method" => "BANK BNI SIPIL",
                "payment_date" => now()->subHours(6),
                "payment_deadline" => now()->addDays(2),
                "note" => "Pembayaran untuk dokumentasi tambahan",
            ],
        ];

        foreach ($transactions as $transaction) {
            Transaction::create($transaction);
        }
    }
}
