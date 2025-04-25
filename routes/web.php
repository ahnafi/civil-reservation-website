<?php

use App\Http\Controllers\PackageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\BookingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, "index"])->name('dashboard');
    Route::get('schedule', [ScheduleController::class, "index"])->name("schedule");
    Route::get('laboratories', function () {
        return Inertia::render('laboratories/index');
    })->name('laboratories');
    Route::get('laboratories/example', function () {
        return Inertia::render('laboratories/example');
    })->name('tests-example');
    Route::get('tests', [TestController::class, "index"])->name('tests');
    Route::get('tests/{test:slug}', [TestController::class, "detail"])->name('tests-detail');
    Route::get('packages', [PackageController::class, "index"])->name('packages');
    Route::get('packages/{package:slug}', [PackageController::class, "detail"])->name('packages-detail');
    Route::get('orders/cart', function () {
        return Inertia::render('orders/cart');
    })->name('orders-cart');
    Route::get('orders/cart/form', function () {
        return Inertia::render('orders/form');
    })->name('orders-cart-form');
    Route::get('orders/status', function () {
        return Inertia::render('orders/status');
    })->name('orders-status');
    Route::get('orders/history', function () {
        return Inertia::render('orders/history');
    })->name('orders-history');
    Route::get('history/submissions', [DashboardController::class, "submissionsHistory"])->name('history-submissions');
    Route::get('history/tests', [DashboardController::class, "testsHistory"])->name('history-tests');
    Route::get('history/transactions', [DashboardController::class, "transactionsHistory"])->name('history-transactions');
    Route::post('/cart/add', [BookingController::class, 'addToCart'])->name('cart.add');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
