<?php

namespace App\Http\Controllers;

use App\Models\Laboratory;
use App\Models\Package;
use App\Models\Submission;
use App\Models\Testing;
use App\Models\Transaction;
use App\Models\Test;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $userSubmissions = Submission::withUserScheduleJoin()->get();

        $userTransactions = Transaction::query()
            ->join('submissions', 'transactions.submission_id', '=', 'submissions.id')
            ->where('submissions.user_id', auth()->id())
            ->orderBy('transactions.created_at', 'desc')
            ->select('transactions.*')
            ->get();


        $userTestings = Testing::query()
            ->join('submissions', 'testings.submission_id', '=', 'submissions.id')
            ->where('submissions.user_id', auth()->id())
            ->orderBy('testings.created_at', 'desc')
            ->select('testings.*')
            ->get();

        $tests = Test::select(['id', 'name'])->get();
        $packages = Package::select(['id', 'name'])->get();
        $laboratories = Laboratory::select(['id', 'code', 'name'])->get();

        return Inertia::render('dashboard/index', [
            'userSubmissions' => $userSubmissions,
            'userTransactions' => $userTransactions,
            'userTestings' => $userTestings,
            'tests' => $tests,
            'packages' => $packages,
            'laboratories' => $laboratories,
        ]);
    }

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
}
