<?php

namespace App\Http\Controllers;

use App\Models\Laboratory;
use App\Models\Test;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class TestController extends Controller
{
    public function index(): Response
    {
        $tests = Test::active()->with(["category", "laboratory"])->paginate(20);
        $laboratories = Laboratory::all();

        return Inertia::render("tests/index", [
            'tests' => $tests,
            'laboratories' => $laboratories
        ]);
    }

    public function detail(Test $test): RedirectResponse|Response
    {
        if (!$test->is_active)
            return redirect()->route('tests');
        return Inertia::render("tests/detail", [
            'test' => $test->load("category", "laboratory", "packages"),
        ]);
    }

    public function apiIndex(Request $request): LengthAwarePaginator
    {
        return Test::active()->with(["category", "laboratory"])->paginate(8);
    }

    public function apiDetail(Test $test): JsonResponse
    {
        return response()->json([
            'data' => $test->load("category", "laboratory", "packages"),
        ]);
    }

    public function apiSearch(Request $request): LengthAwarePaginator
    {
        $query = Test::query()->with(['category', 'laboratory']);

        // Filter by laboratory if provided
        if ($lab = $request->input('lab')) {
            $query->whereHas('laboratory', function ($q) use ($lab) {
                $q->where('id', $lab);
            });
        }

        // Filter by active status (default: true)
        $isActive = $request->boolean('is_active', true);
        if ($isActive) {
            $query->active();
        }

        // Search by title or laboratory name
        if ($search = $request->input('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                    ->orWhereHas('laboratory', function ($q2) use ($search) {
                        $q2->where('name', 'like', '%' . $search . '%');
                    });
            });
        }

        return $query->paginate(16);
    }
}
