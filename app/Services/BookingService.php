<?php

namespace App\Services;

use App\Mail\Resubmission;
use App\Models\Submission;
use Filament\Notifications\Notification;
use Illuminate\Database\Eloquent\Model;
use App\Models\Package;
use App\Models\Test;
use Illuminate\Support\Facades\Log;

use App\Models\Transaction;
use App\Models\Testing;
use App\Models\Schedule;
use App\Models\ScheduleTesting;
use App\Models\SubmissionExternalDetail;
use App\Models\SubmissionInternalDetail;
use Laravel\Pennant\Feature;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Services\FileNaming;
use Illuminate\Support\Facades\Mail;

class BookingService
{
    public function createSubmission(
        $user_id,
        $submission_type,
        $detailData, // array khusus untuk internal atau external
        $test_submission_date,
        $user_note,
        array $submission_tests,
        array $submission_packages
    ) {
        DB::beginTransaction();

        logger()->info('BookingService@createSubmission called', [
            'user_id' => $user_id,
            'submission_type' => $submission_type,
            'detailData' => $detailData,
            'test_submission_date' => $test_submission_date,
            'user_note' => $user_note,
            'submission_tests' => $submission_tests,
            'submission_packages' => $submission_packages
        ]);
        try {
            // 1. Hitung total harga
            $testIds = collect($submission_tests)->pluck('test_id')->filter()->toArray();
            $packageIds = collect($submission_packages)->pluck('package_id')->filter()->toArray();

            $tests = Test::whereIn('id', $testIds)->get()->keyBy('id');
            $packages = Package::whereIn('id', $packageIds)->get()->keyBy('id');

            $total_cost = 0;
            foreach ($submission_tests as $test) {
                $testData = $tests[$test['test_id']] ?? null;
                if ($testData) {
                    $total_cost += $test['unit'] * $testData->price;
                }
            }

            foreach ($packageIds as $packageId) {
                $packageData = $packages[$packageId] ?? null;
                if ($packageData) {
                    $total_cost += $packageData->price;
                }
            }

            // 2. Simpan detail tergantung tipe
            $internalDetailId = null;
            $externalDetailId = null;

            if ($submission_type === 'internal') {
                $internalDetail = SubmissionInternalDetail::create([
                    'name' => $detailData['name'],
                    'program_study' => $detailData['program_study'],
                    'research_title' => $detailData['research_title'],
                    'personnel_count' => $detailData['personnel_count'],
                    'supervisor' => $detailData['supervisor'],
                ]);
                $internalDetailId = $internalDetail->id;
            } elseif ($submission_type === 'external') {
                $externalDetail = SubmissionExternalDetail::create([
                    'company_name' => $detailData['company_name'],
                    'project_name' => $detailData['project_name'],
                    'project_address' => $detailData['project_address'],
                    'total_cost' => $total_cost,
                ]);
                $externalDetailId = $externalDetail->id;
            }

            // 3. Buat Submission
            $submission = Submission::create([
                'user_id' => $user_id,
                'submission_type' => $submission_type,
                'internal_detail_id' => $internalDetailId,
                'submission_external_detail_id' => $externalDetailId,
                'test_submission_date' => $test_submission_date,
                'user_note' => $user_note,
            ]);

            // 4. Tambah relasi pengujian & paket
            foreach ($submission_tests as $test) {
                $submission->tests()->attach($test['test_id'], [
                    'quantity' => $test['unit']
                ]);
            }

            $submission->packages()->attach($packageIds);

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('Error in BookingService@createSubmission', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $user_id,
                'submission_tests' => $submission_tests,
                'submission_packages' => $submission_packages,
                'type' => $submission_type
            ]);

            throw $e;
        }
    }

    public function storePaymentReceipt($transaction_id, $file, $payment_method)
    {
        $transaction = Transaction::findOrFail($transaction_id);
        $transaction->payment_method = $payment_method;

        $extension = $file->getClientOriginalExtension();
        $filename = FileNaming::generatePaymentReceiptName($transaction_id, $extension);

        // Simpan ke storage/app/public/payment_receipt_images/
        $path = $file->storeAs('payment_receipt_images', $filename, 'public');

        // Simpan path relatif ke database
        $transaction->payment_receipt_images = $path;

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
            ->body("Pengujian dengan kode {$record->code} berhasil diajukan ulang.")
            ->success()
            ->send();

        Mail::to($record->user->email)->send(new Resubmission($record->id));

        return redirect()->route('filament.admin.resources.submissions.edit', $submission->id);
    }
}
