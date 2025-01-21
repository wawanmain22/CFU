<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\IndexController;
// Import Admin Controller
use App\Http\Controllers\DonationController;
use App\Http\Controllers\Admin\BatchController as StaffBatchController;
use App\Http\Controllers\Admin\ProfileController as StaffProfileController;

// Import Mahasiswa Controller
use App\Http\Controllers\Admin\DashboardController as StaffDashboardController;
use App\Http\Controllers\Admin\PengajuanController as StaffPengajuanController;
use App\Http\Controllers\Mahasiswa\ProfileController as MahasiswaProfilController;
use App\Http\Controllers\Mahasiswa\HistoryController as MahasiswaHistoryController;

// Import Donation Controller
use App\Http\Controllers\Mahasiswa\DashboardController as MahasiswaDashboardController;
use App\Http\Controllers\Mahasiswa\PengajuanController as MahasiswaPengajuanController;

Route::middleware('guest')->group(function () {
    Route::get('/', [IndexController::class, 'index'])->name('index');

    Route::get('/about', function () {
        return Inertia::render('About');
    });
});


// Donation Routes
Route::group(['prefix' => 'donation'], function () {
    Route::get('/', [DonationController::class, 'index'])->name('donation');
    Route::post('/', [DonationController::class, 'store'])->name('donation.store');
});



// Protected routes
Route::middleware(['auth', 'checkRole'])->group(function () {

    // Staff routes

    // Dashboard Routes
    Route::get('/staff/dashboard', [StaffDashboardController::class, 'index'])->name('staff.dashboard');

    // Batch Routes 
    Route::get('/staff/batch', [StaffBatchController::class, 'index'])->name('staff.batch');
    Route::post('/staff/batch', [StaffBatchController::class, 'store'])->name('staff.batch.store');
    Route::put('/staff/batch/{batch}', [StaffBatchController::class, 'update'])->name('staff.batch.update');

    // Pengajuan Routes
    Route::get('/staff/pengajuan', [StaffPengajuanController::class, 'index'])->name('staff.pengajuan');
    Route::put('/staff/pengajuan/{pengajuan}', [StaffPengajuanController::class, 'update'])->name('staff.pengajuan.update');
    Route::get('/staff/pengajuan/{pengajuan}', [StaffPengajuanController::class, 'show'])->name('staff.pengajuan.show');
    Route::get('/staff/pengajuan/{pengajuan}/file/{type}', [StaffPengajuanController::class, 'downloadFile'])->name('staff.pengajuan.download');

    // Profile Routes
    Route::get('/staff/profile', [StaffProfileController::class, 'index'])->name('staff.profile');
    Route::patch('/staff/profile/phone', [StaffProfileController::class, 'updatePhone'])->name('staff.profile.phone');
    Route::patch('/staff/profile/address', [StaffProfileController::class, 'updateAddress'])->name('staff.profile.address');
    Route::patch('/staff/profile/password', [StaffProfileController::class, 'updatePassword'])->name('staff.profile.password');

    // Student routes

    // Dashboard Routes
    Route::get('/student/dashboard', [MahasiswaDashboardController::class, 'index'])->name('student.dashboard');

    // Pengajuan Routes
    Route::get('/student/pengajuan', [MahasiswaPengajuanController::class, 'index'])->name('student.pengajuan');
    Route::post('/student/pengajuan', [MahasiswaPengajuanController::class, 'store'])->name('student.pengajuan.store');

    // History Routes
    Route::get('/student/history', [MahasiswaHistoryController::class, 'index'])->name('student.history');
    Route::get('/student/history/{pengajuan}', [MahasiswaHistoryController::class, 'show'])->name('student.history.show');
    Route::get('/student/history/{pengajuan}/file/{type}', [MahasiswaHistoryController::class, 'downloadFile'])->name('student.history.download');

    // Profile Routes
    Route::get('/student/profile', [MahasiswaProfilController::class, 'index'])->name('student.profile');
    Route::patch('/student/profile/phone', [MahasiswaProfilController::class, 'updatePhone'])->name('student.profile.phone');
    Route::patch('/student/profile/address', [MahasiswaProfilController::class, 'updateAddress'])->name('student.profile.address');
    Route::patch('/student/profile/password', [MahasiswaProfilController::class, 'updatePassword'])->name('student.profile.password');
});

require __DIR__.'/auth.php';
