<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DonationController;

// Midtrans notification endpoint - no CSRF protection needed
Route::post('/notification', [DonationController::class, 'callback'])
    ->withoutMiddleware(['verify_csrf_token']);
