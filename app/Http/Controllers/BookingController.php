<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Package;
use App\Models\Submission;
use App\Models\Test;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Services\BookingService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Exception;


class BookingController extends Controller
{

    public function submitSubmission(Request $request, BookingService $bookingService)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'project_name' => 'required|string|max:255',
            'project_address' => 'required|string|max:255',
            'total_cost' => 'required|integer|min:0',
            'test_submission_date' => 'required|date',
            'submission_tests' => 'required|array',
            'submission_tests.*.test_id' => 'required|exists:tests,id',
            'submission_tests.*.quantity' => 'required|integer|min:1',
            'submission_packages' => 'required|array',
            'submission_packages.*' => 'exists:packages,id',
        ]);

        try {
            $bookingService->createSubmission(
                auth()->id(),
                $request->company_name,
                $request->project_name,
                $request->project_address,
                $request->total_cost,
                $request->test_submission_date,
                $request->submission_tests,
                $request->submission_packages
            );

            return redirect()->route('history-submissions')
                ->with('Success', 'Pengajuan Berhasil Dibuat!');

        } catch (Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('Error', 'Terjadi kesalahan saat membuat pengajuan. Silakan coba lagi.');
        }
    }


}
