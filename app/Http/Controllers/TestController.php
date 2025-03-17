<?php

namespace App\Http\Controllers;

use App\Models\Test;
use Inertia\Inertia;
use Inertia\Response;

class TestController extends Controller
{
    public function index(): Response
    {
        $tests = Test::active()->with(["category", "laboratory"])->paginate(16);
        return Inertia::render("tests/index", ['tests' => $tests]);
    }

    public function detail(Test $test): \Illuminate\Http\RedirectResponse|Response
    {
        if (!$test->is_active) return redirect()->route('tests');
        return Inertia::render("tests/detail", ['test' => $test->load("category", "laboratory")]);
    }
}
