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


class BookingController extends Controller
{
    public function submitSubmission(submitSubmissionRequest $request, BookingService $bookingService)
    {
        $validated = $request->validated();

        try {
            $userId = auth()->id();
            $submissionType = $validated['submission_type'] ?? 'external';

            // Prepare detail data based on submission type
            $detailData = [];

            if ($submissionType === 'external') {
                $detailData = [
                    'company_name' => $validated['company_name'],
                    'project_name' => $validated['project_name'],
                    'project_address' => $validated['project_address'],
                ];
            } elseif ($submissionType === 'internal') {
                $detailData = [
                    'name' => $validated['name'],
                    'program_study' => $validated['program_study'],
                    'research_title' => $validated['research_title'],
                    'personnel_count' => $validated['personnel_count'],
                    'supervisor' => $validated['supervisor'],
                ];
            }

            // Call the service with correct parameters
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
}
