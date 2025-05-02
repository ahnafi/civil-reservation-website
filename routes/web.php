<?php

use App\Http\Controllers\LaboratoryController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\HistoryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Get Main Page
    Route::get('dashboard', [DashboardController::class, "index"])->name('dashboard');
    Route::get('schedule', [ScheduleController::class, "index"])->name("schedule");
    Route::get('laboratories', [LaboratoryController::class, 'index'])->name('laboratories');
    Route::get('laboratory/{laboratory:slug}', [LaboratoryController::class, 'detail'])->name('laboratory-detail');
    Route::get('tests', [TestController::class, "index"])->name('tests');
    Route::get('test/{test:slug}', [TestController::class, "detail"])->name('tests-detail');
    Route::get('packages', [PackageController::class, "index"])->name('packages');
    Route::get('package/{package:slug}', [PackageController::class, "detail"])->name('packages-detail');

    // Get Booking Page
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
<<<<<<< HEAD
    Route::get('history/submissions', [DashboardController::class, "submissionsHistory"])->name('history-submissions');

    // Get History Page
    Route::get('history/tests', [DashboardController::class, "testsHistory"])->name('history-tests');
    Route::get('history/transactions', [DashboardController::class, "transactionsHistory"])->name('history-transactions');

    // Post Page
    Route::post('cart/submit', [BookingController::class, 'submitSubmission'])->name('createSubmission');
    Route::post('submission/payment', [BookingController::class, 'submitPayment'])->name('submitPayment');
    Route::post('schedule/submit', [ScheduleController::class, 'getSchedule'])->name('schedule.submit');
=======
    Route::get('history/submissions', [HistoryController::class, "submissionsHistory"])->name('history-submissions');
    Route::get('history/submission/{submission:code}', [HistoryController::class, "submissionHistoryDetail"])->name('history-submission-detail');
    Route::get('history/tests', [HistoryController::class, "testsHistory"])->name('history-tests');
    Route::get('history/test/{test:code}', [HistoryController::class, "testHistoryDetail"])->name('history-test-detail');
    Route::get('history/transactions', [HistoryController::class, "transactionsHistory"])->name('history-transactions');
    Route::get('history/transaction/{transaction:code}', [HistoryController::class, "transactionHistoryDetail"])->name('history-transactions-detail');
    Route::post('cart/add', [BookingController::class, 'addToCart'])->name('cart.add');
>>>>>>> frontend
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
