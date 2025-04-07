<?php

namespace App\Http\Controllers;

use App\Models\Laboratory;
use App\Models\Submission;
use App\Models\Test;
use App\Models\Package;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
  public function index(): Response
  {
      $submissions = Submission::withScheduleJoin()->get();
      $tests = Test::select(['id', 'name'])->get();
      $packages = Package::select(['id', 'name'])->get();
      $laboratories = laboratory::select(['id', 'code', 'name'])->get();

      return Inertia::render("schedule/index", [
          'submissions' => $submissions,
          'tests' => $tests,
          'packages' => $packages,
          'laboratories' => $laboratories,
      ]);
  }
}
