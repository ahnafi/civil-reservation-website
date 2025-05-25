<?php

use App\Http\Controllers\DownloadController;
use App\Http\Controllers\ResearchController;
use App\Http\Controllers\TeamController;
use Illuminate\Support\Facades\Route;

// API Routes
// Team Routes
Route::get("team", [TeamController::class, "index"])->name("team.index");

// Research Routes
Route::get("research", [ResearchController::class, "index"])->name("research.index");
Route::get("research/search", [ResearchController::class, "search"])->name("research.search");

// Download Routes
Route::get("downloads",[DownloadController::class,"index"])->name("download.index");
Route::get("downloads/search", [DownloadController::class, "search"])->name("download.search");
