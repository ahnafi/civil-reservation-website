<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Submission;
use App\Models\Test;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Http\Requests\submitSubmissionRequest;
use App\Models\Transaction;
use App\Services\BookingService;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Exception;
use App\Exceptions\SlotUnavailableException;
use App\Utils\BookingUtils;

class BookingController extends Controller
{
    public function submitSubmission(submitSubmissionRequest $request, BookingService $bookingService)
    {
        $validated = $request->validated();

        try {
            $userId = auth()->id();
            $submissionType = $validated['submission_type'] ?? 'external';

            // Prepare detail data based on submission type
            $detailData = $submissionType === 'external'
                ? [
                    'company_name' => $validated['company_name'],
                    'project_name' => $validated['project_name'],
                    'project_address' => $validated['project_address'],
                ]
                : [
                    'name' => $validated['name'],
                    'program_study' => $validated['program_study'],
                    'research_title' => $validated['research_title'],
                    'personnel_count' => $validated['personnel_count'],
                    'supervisor' => $validated['supervisor'],
                ];

            // Create the submission
            $bookingService->createSubmission(
                $userId,
                $submissionType,
                $detailData,
                $validated['test_submission_date'],
                $validated['user_note'] ?? null,
                $validated['submission_tests'] ?? [],
                $validated['submission_packages'] ?? []
            );

            return redirect()->route('orders-cart-checkout')
                ->with('Success', 'Pengajuan Berhasil Dibuat!');
        } catch (SlotUnavailableException $e) {
            return redirect()->back()
                ->withInput()
                ->with('Error', 'Slot penuh untuk pengujian: ' . implode(', ', $e->getUnavailableTests()));
        } catch (\Exception $e) {
            Log::error('Submission failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => auth()->id(),
                'input' => $validated
            ]);

            return redirect()->back()
                ->withInput()
                ->with('Error', 'Terjadi kesalahan saat membuat pengajuan. Silakan coba lagi.');
        }
    }

    public function payment($code): Response
    {
        $transaction = Transaction::query()
            ->join('submissions', 'transactions.submission_id', '=', 'submissions.id')
            ->where('submissions.user_id', auth()->id())
            ->where('transactions.code', $code)
            ->select('transactions.*', 'submissions.code as submission_code')
            ->get();

        return Inertia::render('orders/payment', [
            'transactionDetail' => $transaction,
        ]);
    }

    public function submitPayment(Request $request, BookingService $bookingService)
    {
        $validated = $request->validate([
            'transaction_id' => 'required|integer|exists:transactions,id',
            'payment_receipt' => 'required|image|mimes:jpeg,png,jpg|max:5120',
            'payment_method' => 'required|string|in:BANK JATENG,BANK MANDIRI,BANK BNI,BANK BRI,BANK BSI,BANK BTN',
        ]);

        try {
            $bookingService->storePaymentReceipt(
                $validated['transaction_id'],
                $validated['payment_receipt'],
                $validated['payment_method']
            );

            return redirect()->route('history-transactions')
                ->with('success', 'Bukti Pembayaran Berhasil Diupload!');
        } catch (Exception $e) {
            Log::error('Payment submission failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'transaction_id' => $validated['transaction_id']
            ]);

            return redirect()->back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan saat mengupload bukti pembayaran. Silakan coba lagi.');
        }
    }

    public function checkAvailability(Request $request)
    {
        $validated = $request->validate([
            'test_ids' => 'required|array',
            'test_ids.*' => 'integer|exists:tests,id',
            'package_ids' => 'nullable|array',
            'package_ids.*' => 'integer|exists:packages,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date'
        ]);

        try {
            $testIds = collect($validated['test_ids']);
            $packageIds = collect($validated['package_ids'] ?? []);

            // Ambil test IDs dari packages
            if ($packageIds->isNotEmpty()) {
                $packageTestIds = Package::whereIn('id', $packageIds)
                    ->with('tests')
                    ->get()
                    ->flatMap(fn($p) => $p->tests->pluck('id'));

                $testIds = $testIds->merge($packageTestIds);
            }

            $allTestIds = $testIds->unique()->values()->toArray();

            // Generate tanggal dari start_date ke end_date
            $startDate = new \DateTime($validated['start_date']);
            $endDate = new \DateTime($validated['end_date']);
            $unavailableDates = [];

            while ($startDate <= $endDate) {
                $dateString = $startDate->format('Y-m-d');

                // Cek apakah ada test yang tidak tersedia di tanggal ini
                $unavailableTestNames = BookingUtils::getUnavailableTestNames($allTestIds, $dateString);

                if (!empty($unavailableTestNames)) {
                    $unavailableDates[] = [
                        'date' => $dateString,
                        'unavailable_tests' => $unavailableTestNames
                    ];
                }

                $startDate->modify('+1 day');
            }

            return response()->json([
                'success' => true,
                'unavailable_dates' => $unavailableDates
            ]);
        } catch (\Exception $e) {
            Log::error('Availability check failed:', [
                'error' => $e->getMessage(),
                'input' => $validated
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal memeriksa ketersediaan'
            ], 500);
        }
    }
}
