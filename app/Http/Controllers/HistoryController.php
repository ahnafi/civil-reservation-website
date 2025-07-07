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
        $submissionId = Submission::query()
            ->where('user_id', auth()->id())
            ->where('code', $code)
            ->value('id');

        $submissionHistoryDetail = Submission::withUserScheduleJoin()
            ->where('submissions.user_id', auth()->id())
            ->where('submissions.code', $code)
            ->get();

        $relatedTransaction = Transaction::query()
            ->where('submission_id', $submissionId)
            ->orderBy('created_at', 'asc')
            ->get();

        $relatedTesting = Testing::query()
            ->where('submission_id', $submissionId)
            ->orderBy('created_at', 'asc')
            ->get();


        return Inertia::render('history/detail/submission', [
            'submissionHistoryDetail' => $submissionHistoryDetail,
            'relatedTransaction' => $relatedTransaction,
            'relatedTesting' => $relatedTesting,
        ]);
    }

    public function transactionHistoryDetail($code): Response
    {
        $transactionHistoryDetail = Transaction::query()
            ->join('submissions', 'transactions.submission_id', '=', 'submissions.id')
            ->where('submissions.user_id', auth()->id())
            ->where('transactions.code', $code)
            ->select('transactions.*', 'submissions.code as submission_code')
            ->get();

        return Inertia::render('history/detail/transaction', [
            'transactionHistoryDetail' => $transactionHistoryDetail,
        ]);
    }

    public function testHistoryDetail($code): Response
    {
        $testHistoryDetail = Testing::with(['reviews'])
            ->join('submissions', 'testings.submission_id', '=', 'submissions.id')
            ->where('submissions.user_id', auth()->id())
            ->where('testings.code', $code)
            ->select('testings.*', 'submissions.code as submission_code')
            ->get();


        return Inertia::render('history/detail/test', [
            'testHistoryDetail' => $testHistoryDetail,
        ]);
    }
}
