<?php

use App\Http\Controllers\TestController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function() {
        return Inertia::render('dashboard/index');
    })->name('dashboard');
    Route::get('schedule', function () {
        return Inertia::render('schedule/index');
    })->name('schedule');
    Route::get('laboratories', function () {
        return Inertia::render('laboratories/index');
    })->name('laboratories');
    Route::get('laboratories/example', function () {
        return Inertia::render('laboratories/example');
    })->name('tests-example');
    Route::get('tests',[TestController::class,"index"])->name('tests');
    Route::get('tests/{test:slug}',[TestController::class,"detail"])->name('tests-detail');
    Route::get('packages', function () {
        return Inertia::render('packages/index');
    })->name('packages');
    Route::get('packages/example', function () {
        return Inertia::render('packages/example');
    })->name('packages-example');
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
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
