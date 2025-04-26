<?php

namespace App\Services;

use App\Models\Submission;
use App\Models\Package;
use App\Models\Test;
use App\Models\Transaction;
use Laravel\Pennant\Feature;
use Illuminate\Support\Facades\DB;
use App\Services\FileNaming;


class BookingService
{
    public function createSubmission(
        $user_id,
        $company_name,
        $project_name,
        $project_address,
        $test_submission_date,
        array $submission_tests,
        array $submission_packages
    ) {
        DB::beginTransaction();

        try {
            $total_cost = 0;

            $testIds = collect($submission_tests)->pluck('test_id')->filter()->toArray();
            $packageIds = collect($submission_packages)->pluck('package_id')->filter()->toArray();

            $tests = Test::whereIn('id', $testIds)->get()->keyBy('id');
            $packages = Package::whereIn('id', $packageIds)->get()->keyBy('id');

            $total_cost = 0;

            foreach ($submission_tests as $test) {
                $testData = $tests[$test['test_id']] ?? null;
                if ($testData) {
                    $total_cost += $test['quantity'] * $testData->price;
                }
            }

            foreach ($submission_packages as $package) {
                $packageData = $packages[$package['package_id']] ?? null;
                if ($packageData) {
                    $total_cost += $packageData->price;
                }
            }

            $submission = new Submission();
            $submission->user_id = $user_id;
            $submission->company_name = $company_name;
            $submission->project_name = $project_name;
            $submission->project_address = $project_address;
            $submission->total_cost = $total_cost;
            $submission->test_submission_date = $test_submission_date;
            $submission->save();

            foreach ($submission_tests as $test) {
                $submission->tests()->attach($test['test_id'], [
                    'quantity' => $test['quantity']
                ]);
            }

            foreach ($submission_packages as $package) {
                $submission->packages()->attach($submission_packages);
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function storePaymentReceipt($transaction_id, $file, $payment_method)
    {
        $transaction = Transaction::findOrFail($transaction_id);
        $transaction->payment_method = $payment_method;

        $extension= $file->getClientOriginalExtension();
        $filename = FileNaming::generatePaymentReceiptName($transaction_id, $extension);
        $file->storeAs('public/payment_receipts', $filename);

        $transaction->payment_receipt_image = $filename;
        $transaction->save();
    }

}
