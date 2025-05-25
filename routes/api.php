<?php

use App\Http\Controllers\DownloadController;
use App\Http\Controllers\LaboratoryController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ResearchController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TestController;
use Illuminate\Support\Facades\Route;

// API Routes
// Team Routes
Route::get("team", [TeamController::class, "index"])->name("team.index");

// Research Routes
Route::get("research", [ResearchController::class, "index"])->name("research.index");
Route::get("research/search", [ResearchController::class, "search"])->name("research.search");

// Download Routes
Route::get("downloads", [DownloadController::class, "index"])->name("download.index");
Route::get("downloads/search", [DownloadController::class, "search"])->name("download.search");

// News Routes
Route::get("news", [NewsController::class, "index"])->name("news.index");
Route::get("news/{news:slug}", [NewsController::class, "show"])->name("news.show");
Route::get("news/search", [NewsController::class, "search"])->name("news.search");

// labs and testing routes
Route::get("tests", [TestController::class, "apiIndex"])->name("tests.api.index");
Route::get("tests/{test:slug}", [TestController::class, "apiDetail"])->name("tests.api.detail");
Route::get("tests/search", [TestController::class, "apiSearch"])->name("tests.api.search");

Route::get("labs", [LaboratoryController::class, "apiLabs"])->name("labs.api.index");
Route::get("labs/{laboratory:slug}", [LaboratoryController::class, "apiDetail"])->name("labs.api.detail");
