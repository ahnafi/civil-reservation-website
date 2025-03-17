<?php

namespace App\Http\Controllers;

use App\Models\Test;
use Inertia\Inertia;

class TestController extends Controller
{
    public function index(): \Inertia\Response
    {
        $tests = Test::with(["category", "laboratory"])->paginate(16);
        return Inertia::render("tests/index", ['tests' => $tests]);
    }
}
