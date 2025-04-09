<?php

namespace App\Http\Controllers;
use App\Models\Laboratory;
use App\Models\Package;
use App\Models\submission;
use App\Models\Test;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $userSubmissions = submission::withUserScheduleJoin()->get();
        $tests = Test::select(['id', 'name'])->get();
        $packages = Package::select(['id', 'name'])->get();
        $laboratories = laboratory::select(['id', 'code', 'name'])->get();

        return Inertia::render('dashboard/index', [
            'userSubmissions' => $userSubmissions,
            'tests' => $tests,
            'packages' => $packages,
            'laboratories' => $laboratories,
        ]);
    }
}
