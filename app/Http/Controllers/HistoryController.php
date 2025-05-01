<?php

namespace App\Http\Controllers;

use App\Models\Laboratory;
use App\Models\Package;
use App\Models\Submission;
use App\Models\Test;
use App\Models\Testing;
use App\Models\Transaction;
use Inertia\Inertia;
use Inertia\Response;

class HistoryController extends Controller
{

    public function submissionsHistory(): Response
    {
        $userSubmissions = Submission::withUserScheduleJoin()
            ->where('submissions.user_id', auth()->id())
            ->get();

        $tests = Test::select(['id', 'name'])->get();
        $packages = Package::select(['id', 'name'])->get();
        $laboratories = Laboratory::select(['id', 'code', 'name'])->get();

        return Inertia::render('history/submissions', [
            'userSubmissions' => $userSubmissions,
            'tests' => $tests,
            'packages' => $packages,
            'laboratories' => $laboratories,
        ]);
    }

    public function testsHistory(): Response
    {
        $userTestings = Testing::query()
            ->join('submissions', 'testings.submission_id', '=', 'submissions.id')
            ->where('submissions.user_id', auth()->id())
            ->orderBy('testings.created_at', 'desc')
            ->select('testings.*')
            ->get();

        $tests = Test::select(['id', 'name'])->get();
        $packages = Package::select(['id', 'name'])->get();
        $laboratories = Laboratory::select(['id', 'code', 'name'])->get();

        return Inertia::render('history/tests', [
            'userTestings' => $userTestings,
            'tests' => $tests,
            'packages' => $packages,
            'laboratories' => $laboratories,
        ]);
    }

    public function transactionsHistory(): Response
    {
        $userTransactions = Transaction::query()
            ->join('submissions', 'transactions.submission_id', '=', 'submissions.id')
            ->where('submissions.user_id', auth()->id())
            ->orderBy('transactions.created_at', 'desc')
            ->select('transactions.*')
            ->get();

        $tests = Test::select(['id', 'name'])->get();
        $packages = Package::select(['id', 'name'])->get();
        $laboratories = Laboratory::select(['id', 'code', 'name'])->get();

        return Inertia::render('history/transactions', [
            'userTransactions' => $userTransactions,
            'tests' => $tests,
            'packages' => $packages,
            'laboratories' => $laboratories,
        ]);
    }

    public function submissionHistoryDetail($code): Response
    {
        $submissionHistoryDetail = Submission::withUserScheduleJoin()
            ->where('submissions.user_id', auth()->id())
            ->where('submissions.code', $code)
            ->get();

        return Inertia::render('history/detail/submission', [
            'submissionHistoryDetail' => $submissionHistoryDetail,
        ]);
    }

    public function transactionHistoryDetail($code): Response
    {
        $transactionHistoryDetail = Transaction::query()
            ->join('submissions', 'transactions.submission_id', '=', 'submissions.id')
            ->where('submissions.user_id', auth()->id())
            ->where('transactions.code', $code)
            ->get();

        return Inertia::render('history/detail/transaction', [
            'transactionCode' => $transactionHistoryDetail[0]->code,
            'transactionHistoryDetail' => $transactionHistoryDetail,
        ]);
    }

    public function testHistoryDetail($code): Response
    {
        $testHistoryDetail = Testing::withUserScheduleJoin()
            ->where('testings.user_id', auth()->id())
            ->where('testings.code', $code)
            ->get();

        return Inertia::render('history/detail/test', [
            'testHistoryDetail' => $testHistoryDetail,
        ]);
    }
}
