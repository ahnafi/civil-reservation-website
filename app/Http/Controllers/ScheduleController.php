<?php

namespace App\Http\Controllers;

use App\Models\Test;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render("schedule/index");
    }
}
