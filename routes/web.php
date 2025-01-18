<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Import Admin Controller
use App\Http\Controllers\Admin\BatchController as StaffBatchController;
use App\Http\Controllers\Admin\DashboardController as StaffDashboardController;
use App\Http\Controllers\Admin\PengajuanController as StaffPengajuanController;
use App\Http\Controllers\Admin\ProfileController as StaffProfileController;

// Import Mahasiswa Controller
use App\Http\Controllers\Mahasiswa\DashboardController as MahasiswaDashboardController;
use App\Http\Controllers\Mahasiswa\PengajuanController as MahasiswaPengajuanController;
use App\Http\Controllers\Mahasiswa\ProfileController as MahasiswaProfilController;
use App\Models\Mahasiswa;

Route::middleware('guest')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Index');
    });
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

    // Profile Routes
    Route::get('/staff/profile', [StaffProfileController::class, 'index'])->name('staff.profile');
    
    // Student routes
    Route::get('/student/dashboard', [MahasiswaDashboardController::class, 'index'])->name('student.dashboard');
    Route::get('/student/pengajuan', [MahasiswaPengajuanController::class, 'index'])->name('student.pengajuan');
    Route::get('/student/profile', [MahasiswaProfilController::class, 'index'])->name('student.profile');
});

require __DIR__.'/auth.php';
