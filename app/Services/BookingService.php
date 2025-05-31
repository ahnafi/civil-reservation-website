<?php

namespace App\Services;

use App\Models\Submission;
use Filament\Notifications\Notification;
use Illuminate\Database\Eloquent\Model;
use App\Models\Package;
use App\Models\Test;
use App\Models\Transaction;
use App\Models\Testing;
use App\Models\Schedule;
use App\Models\ScheduleTesting;
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
        $user_note,
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
            $submission->user_note = $user_note;
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

    public function storeScheduleTesting($testing_id)
    {
        $testIds = BookingUtils::getTestIdsFromTesting($testing_id);
        BookingUtils::handleScheduleForTesting($testing_id, $testIds);
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
