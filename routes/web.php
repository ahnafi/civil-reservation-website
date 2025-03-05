<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('tests', function () {
        return Inertia::render('tests/index');
    })->name('tests');
    Route::get('tests/example', function () {
        return Inertia::render('tests/example');
    })->name('tests-example');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
