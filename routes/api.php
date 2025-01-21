<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DonationController;

// Midtrans notification endpoint - no CSRF protection needed
Route::post('/notification', [DonationController::class, 'callback'])
    ->withoutMiddleware(['verify_csrf_token']);

// Payment status routes
Route::get('/finish', [DonationController::class, 'finishUrl'])->name('donation.finish');
Route::get('/unfinish', [DonationController::class, 'unfinishUrl'])->name('donation.unfinish');
Route::get('/error', [DonationController::class, 'errorPaymentUrl'])->name('donation.error');

// DANA notification endpoint
Route::post('/notification/v1.0/debit/notify', [DonationController::class, 'handleDanaNotification']);
