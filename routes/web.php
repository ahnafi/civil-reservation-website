<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\LaboratoryController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\HistoryController;
use App\Http\Middleware\RoleMiddleware;
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
    Route::get('orders/cart', [CartController::class, 'cart'])->name('orders-cart');
    Route::get('orders/form', [CartController::class, 'form'])->name('orders-cart-form');
    Route::get('orders/checkout', function () {
        return Inertia::render('orders/checkout');
    })->name('orders-cart-checkout');
    Route::get('orders/status', function () {
        return Inertia::render('orders/status');
    })->name('orders-status');
    Route::get('orders/history', function () {
        return Inertia::render('orders/history');
    })->name('orders-history');

    // Get Payment Page
    Route::get('payment/{transaction:code}', [BookingController::class, "payment"])->name('orders-payment');

    // Get Submission History
    Route::get('history/submissions', [HistoryController::class, "submissionsHistory"])->name('history-submissions');
    Route::get('history/submission/{submission:code}', [HistoryController::class, "submissionHistoryDetail"])->name('history-submission-detail');

    // Get Test History
    Route::get('history/tests', [HistoryController::class, "testsHistory"])->name('history-tests');
    Route::get('history/test/{test:code}', [HistoryController::class, "testHistoryDetail"])->name('history-test-detail');

    // Get Transaction History
    Route::get('history/transactions', [HistoryController::class, "transactionsHistory"])->name('history-transactions');
    Route::get('history/transaction/{transaction:code}', [HistoryController::class, "transactionHistoryDetail"])->name('history-transactions-detail');
    Route::post('cart/add', [BookingController::class, 'addToCart'])->name('cart.add');

    // Get Tutorial Page
    Route::get('tutorial', function () {
        return Inertia::render('tutorial/index');
    })->name('tutorial');

    // Post Page
    Route::post('payment', [BookingController::class, 'submitPayment'])->name('submit-payment');
    Route::post('schedule/submit', [ScheduleController::class, 'getSchedule'])->name('schedule.submit');
    Route::post('cart/submit', [BookingController::class, 'submitSubmission'])->name('createSubmission');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
