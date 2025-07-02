<?php

namespace App\Services;

use App\Exceptions\SlotUnavailableException;
use App\Mail\Resubmission;
use App\Models\Submission;
use Filament\Notifications\Notification;
use Illuminate\Database\Eloquent\Model;
use App\Models\Package;
use App\Models\Test;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
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
        int $user_id,
        string $submission_type,
        array $detailData, // array khusus untuk internal atau external
        string $test_submission_date,
        string $user_note,
        array $submission_tests,
        array $submission_packages
    ): void {

        $testIds = collect($submission_tests)->pluck('test_id')->filter()->toArray();
        $packageIds = collect($submission_packages)->pluck('package_id')->filter()->toArray();

        $packageTestIds = Package::whereIn('id', $packageIds)
            ->with('tests')
            ->get()
            ->flatMap(fn($p) => $p->tests->pluck('id'))
            ->toArray();

        $allTestIds = array_unique(array_merge($testIds, $packageTestIds));

        $unavailableTestNames = BookingUtils::getUnavailableTestNames($allTestIds, $test_submission_date);

        if (!empty($unavailableTestNames)) {
            throw new SlotUnavailableException($unavailableTestNames);
        }

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
                'submission_internal_detail_id' => $internalDetailId,
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

    public function storePaymentReceipt(int $transaction_id, UploadedFile $file, string $payment_method): void
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

    public function storeScheduleTesting(int $testing_id): void
    {
        $testIds = BookingUtils::getTestIdsFromTesting($testing_id);
        BookingUtils::handleScheduleForTesting($testing_id, $testIds);
    }

    public function recreateSubmission(Model $record): RedirectResponse
    {
        DB::beginTransaction();

        try {
            // Eager load submission dengan relasi yang diperlukan
            $originalSubmission = $record->submission()->with([
                'user',
                'tests',
                'packages',
                'externalDetail',
                'internalDetail'
            ])->first();

            if (!$originalSubmission) {
                throw new \Exception('Submission tidak ditemukan');
            }

            // Step 1: Duplikasi detail tables berdasarkan tipe submission
            $internalDetailId = null;
            $externalDetailId = null;

            if ($originalSubmission->submission_type === 'external' && $originalSubmission->externalDetail) {
                $externalDetail = $originalSubmission->externalDetail;
                $newExternalDetail = SubmissionExternalDetail::create([
                    'company_name' => $externalDetail->company_name,
                    'project_name' => $externalDetail->project_name,
                    'project_address' => $externalDetail->project_address,
                    'total_cost' => $externalDetail->total_cost,
                ]);
                $externalDetailId = $newExternalDetail->id;
            }

            if ($originalSubmission->submission_type === 'internal' && $originalSubmission->internalDetail) {
                $internalDetail = $originalSubmission->internalDetail;
                $newInternalDetail = SubmissionInternalDetail::create([
                    'name' => $internalDetail->name,
                    'program_study' => $internalDetail->program_study,
                    'research_title' => $internalDetail->research_title,
                    'personnel_count' => $internalDetail->personnel_count,
                    'supervisor' => $internalDetail->supervisor,
                ]);
                $internalDetailId = $newInternalDetail->id;
            }

            // Step 2: Duplikasi data utama submission
            $submission = Submission::create([
                "user_id" => $originalSubmission->user_id,
                "submission_type" => $originalSubmission->submission_type,
                "submission_internal_detail_id" => $internalDetailId,
                "submission_external_detail_id" => $externalDetailId,
                "documents" => $originalSubmission->documents,
                "test_submission_date" => $originalSubmission->test_submission_date,
                "user_note" => $originalSubmission->user_note,
                "status" => "submitted", // Reset status ke submitted untuk persetujuan ulang
            ]);

            // Step 3: Duplikasi relasi tests (dengan pivot "quantity")
            if ($originalSubmission->tests->isNotEmpty()) {
                $testData = [];
                foreach ($originalSubmission->tests as $test) {
                    $testData[$test->id] = ['quantity' => $test->pivot->quantity];
                }
                $submission->tests()->attach($testData);
            }

            // Step 4: Duplikasi relasi packages
            if ($originalSubmission->packages->isNotEmpty()) {
                $submission->packages()->attach(
                    $originalSubmission->packages->pluck('id')->toArray()
                );
            }

            DB::commit();

            // Step 5: Notifikasi dan email
            Notification::make()
                ->title('Pengajuan ulang berhasil')
                ->body("Pengujian dengan kode {$record->code} berhasil diajukan ulang dengan kode {$submission->code}.")
                ->success()
                ->send();

            Mail::to($originalSubmission->user->email)->send(new Resubmission($submission->id));

            if($originalSubmission->submission_type === 'external'){
                return redirect()->route('filament.admin.resources.submission-external-details.edit', $externalDetailId);
            }else{
                return redirect()->route('filament.admin.resources.submission-internal-details.edit', $internalDetailId);
            }

        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('Error in BookingService@recreateSubmission', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'testing_id' => $record->id,
            ]);

            Notification::make()
                ->title('Pengajuan ulang gagal')
                ->body('Terjadi kesalahan saat membuat pengajuan ulang: ' . $e->getMessage())
                ->danger()
                ->send();

            throw $e;
        }
    }
}
