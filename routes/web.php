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
    Route::get('dashboard', [DashboardController::class, "index"])->name('dashboard');  // Clear
    Route::get('schedule', [ScheduleController::class, "index"])->name("schedule"); // Fix and stylize more of the jadwal terambil card --DONE
    Route::get('laboratories', [LaboratoryController::class, 'index'])->name('laboratories'); // Clear
    Route::get('laboratory/{laboratory:slug}', [LaboratoryController::class, 'detail'])->name('laboratory-detail'); // clear? probably add paginaton on Pengujian Tersedia; add grid for the description detail icon to save space on mobile view
    Route::get('tests', [TestController::class, "index"])->name('tests'); // add lab filter --DONE
    Route::get('test/{test:slug}', [TestController::class, "detail"])->name('tests-detail'); // clear? add grid for the description detail icon to save space on mobile view
    Route::get('packages', [PackageController::class, "index"])->name('packages'); // add search feature and lab filter, fix all the height, make the Test yang termasuk compact by scrolling
    Route::get('package/{package:slug}', [PackageController::class, "detail"])->name('packages-detail'); // fix detail button on mobile view to be on the most right side
    // Main Page: Add multiple photos for catalog to test multiple photo compability, add finger pointer for hovering to a button

    // Get Booking Page
    Route::get('orders/cart', [CartController::class, 'cart'])->name('orders-cart'); // Clear
    Route::get('orders/form', [CartController::class, 'form'])->name('orders-cart-form'); // add better ux feel when clicking through a date; add Fakultas Teknik address, can be for placeholder if the test is on Fakultas Teknik
    Route::get('orders/checkout', function () {
        return Inertia::render('orders/checkout');
    })->name('orders-cart-checkout'); // can only be accessed after creating a submission by submitting the form
    Route::get('orders/history', function () {
        return Inertia::render('orders/history');
    })->name('orders-history'); // ????? delete

    // Get Submission History
    Route::get('history/submissions', [HistoryController::class, "submissionsHistory"])->name('history-submissions'); // fix the jenis pengujian searching filter
    // add submission card count summary for every status or just submitted, approved, rejected; encode the submission status to indonesian --DONE
    Route::get('history/submission/{submission:code}', [HistoryController::class, "submissionHistoryDetail"])->name('history-submission-detail'); // add grid for the description detail icon to save space on mobile view

    // Get Test History
    Route::get('history/testings', [HistoryController::class, "testingHistory"])->name('history-testing');
    Route::get('history/testings/{test:code}', [HistoryController::class, "testingHistoryDetail"])->name('history-testing-detail');
    // Change all to Testing for clarity --DONE
    // add testing card count summary for every status encode the submission status to indonesian --DONE
    // change the status for waiting the result or waiting for the test --DONE
    // encode the testing status to indonesia --DONE

    // Get Transaction History
    Route::get('history/transactions', [HistoryController::class, "transactionsHistory"])->name('history-transactions');
    Route::get('history/transaction/{transaction:code}', [HistoryController::class, "transactionHistoryDetail"])->name('history-transactions-detail');

    // Get Payment Page
    Route::get('payment/{transaction:code}', [BookingController::class, "payment"])->name('orders-payment');

    // add transaction card count summary for every status encode the submission status to indonesian
    // change the status
    // encode the transaction status to indonesia
    // add status enum type of transaction on database to differentiate between the main payment and accomodation
    // fix the unduh invoice on payment page

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
