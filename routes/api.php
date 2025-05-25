<?php

use App\Http\Controllers\TeamController;
use Illuminate\Support\Facades\Route;

Route::get("team", [TeamController::class, "index"])->name("team.index");