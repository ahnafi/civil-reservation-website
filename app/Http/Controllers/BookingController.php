<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Submission;
use App\Models\Test;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Http\Requests\submitSubmissionRequest;
use App\Services\BookingService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Exception;


class BookingController extends Controller
{

    public function submitSubmission(submitSubmissionRequest $request, BookingService $bookingService)
    {
        $validated = $request->validated();

        try {
            $bookingService->createSubmission(
                auth()->id(),
                $validated['company_name'],
                $validated['project_name'],
                $validated['project_address'],
                $validated['test_submission_date'],
                $validated['user_note'],
                $validated['admin_note'],
                $validated['submission_tests'],
                $validated['submission_packages']
            );

            return redirect()->route('history-submissions')
                ->with('Success', 'Pengajuan Berhasil Dibuat!');

        } catch (Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('Error', 'Terjadi kesalahan saat membuat pengajuan. Silakan coba lagi.');
        }
    }

    public function submitPayment(Request $request, BookingService $bookingService)
    {
        $validated = $request->validate([
            'transaction_id' => 'required|integer|exists:transaction,id',
            'payment_receipt' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'payment_method' => 'required|string|in:BANK JATENG,BANK MANDIRI,BANK BNI,BANK BRI,BANK BSI,BANK BTN',
        ]);


        try{
            $bookingService->storePaymentReceipt(
                $validated['transaction_id'],
                $validated['payment_receipt'],
                $validated['payment_method']
            );

            return redirect()->route('orders-status')
                ->with('Success', 'Bukti Pembayaran Berhasil Diupload!');
        } catch(Exception $e){
            return redirect()->back()
                ->withInput()
                ->with('Error', 'Terjadi kesalahan saat mengupload bukti pembayaran. Silakan coba lagi.');
        }
    }
}
