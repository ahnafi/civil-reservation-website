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
        $userSubmissions = Submission::WithUserScheduleJoin()
            ->limit(5)
            ->get();

        $userSubmissionsCount = Submission::query()
            ->where('user_id', auth()->id())
            ->count();

        $userSubmissionsIds = Submission::query()
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->pluck('id');

        $userTransactions = Transaction::query()
            ->whereIn('submission_id', $userSubmissionsIds)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $userTransactionsCount = Transaction::query()
            ->whereIn('submission_id', $userSubmissionsIds)
            ->count();

        $userTestings = Testing::query()
            ->whereIn('submission_id', $userSubmissionsIds)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $userUpcomingTestings = Testing::query()
            ->whereIn('submission_id', $userSubmissionsIds)
            ->where('status', 'testing')
            ->where('test_date', '>', now())
            ->orderBy('test_date', 'asc')
            ->get();

        $userTestingCount = Testing::query()
            ->whereIn('submission_id', $userSubmissionsIds)
            ->count();

        return Inertia::render('dashboard/index', [
            'userSubmissions' => $userSubmissions,
            'userTransactions' => $userTransactions,
            'userTestings' => $userTestings,
            'userUpcomingTestings' => $userUpcomingTestings,
            'userSubmissionsCount' => $userSubmissionsCount,
            'userTransactionsCount' => $userTransactionsCount,
            'userTestingCount' => $userTestingCount,
        ]);
    }
}
