<?php

    namespace App\Http\Controllers;

    use App\Models\Laboratory;
    use App\Models\Submission;
    use App\Models\Test;
    use App\Models\Package;
    use App\Models\Schedule;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\DB;
    use Inertia\Inertia;
    use Inertia\Response;

    class ScheduleController extends Controller
    {
    //  public function index(): Response
    //  {
    //      $submissions = Submission::withScheduleJoin()->get();
    //      $tests = Test::select(['id', 'name'])->get();
    //      $packages = Package::select(['id', 'name'])->get();
    //      $laboratories = Laboratory::select(['id', 'code', 'name'])->get();
    //
    //
    //      return Inertia::render("schedule/index", [
    //          'submissions' => $submissions,
    //          'tests' => $tests,
    //          'packages' => $packages,
    //          'laboratories' => $laboratories,
    //      ]);
    //  }

        public function index(): Response
        {
            $tests = Test::select(['id', 'name'])->get();

            return Inertia::render('schedule/newIndex', [
                'tests' => $tests,
            ]);
        }

        public function getSchedule(Request $request)
        {
            $validated = $request->validate([
                'test_id' => 'required|integer|exists:tests,id',
            ]);

            $test = DB::table('tests')
                ->select(
                    'tests.id',
                    'tests.name',
                    'tests.description',
                    'tests.images',
                    'tests.minimum_unit',
                    'tests.daily_slot',
                    'tests.is_active',
                    'categories.id as category_id',
                    'categories.name as category_name',
                    'laboratories.id as laboratory_id',
                    'laboratories.code as laboratory_code',
                    'laboratories.name as laboratory_name'
                )
                ->leftJoin('categories', 'tests.category_id', '=', 'categories.id')
                ->leftJoin('laboratories', 'tests.laboratory_id', '=', 'laboratories.id')
                ->where('tests.id', $validated['test_id'])
                ->first();

            if ($test) {
                $test->images = json_decode($test->images);
            }

            $test_schedule = Schedule::select(['id', 'date', 'available_slots'])->where('test_id', $validated['test_id'])->get();

            $test_schedule = DB::table('schedules')
                ->select([
                    'schedules.id',
                    'schedules.date',
                    'schedules.available_slots',
                    DB::raw('COUNT(DISTINCT CASE WHEN submissions.status = "approved" THEN testings.id END) as approved_count'),
                    DB::raw('COUNT(DISTINCT CASE WHEN submissions.status = "submitted" THEN testings.id END) as pending_count')
                ])
                ->leftJoin('testings', function($join) use ($validated) {
                    $join->on('schedules.date', '=', 'testings.test_date')
                        ->whereNull('testings.deleted_at');
                })
                ->leftJoin('submissions', function($join) {
                    $join->on('testings.submission_id', '=', 'submissions.id')
                        ->whereNull('submissions.deleted_at');
                })
                ->leftJoin('submission_test', function($join) use ($validated) {
                    $join->on('submissions.id', '=', 'submission_test.submission_id')
                        ->where('submission_test.test_id', '=', $validated['test_id']);
                })
                ->where('schedules.test_id', $validated['test_id'])
                ->groupBy('schedules.id', 'schedules.date', 'schedules.available_slots')
                ->get();

            return response()->json([
                'testData' => $test,
                'schedules' => $test_schedule,
            ]);
        }
    }
