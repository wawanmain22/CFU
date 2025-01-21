<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Pengajuan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index():Response
    {
        $user = Auth::user();
        
        // Get statistics
        $stats = [
            'total' => Pengajuan::where('user_id', $user->id)->count(),
            'pending' => Pengajuan::where('user_id', $user->id)->where('status', 'pending')->count(),
            'approved' => Pengajuan::where('user_id', $user->id)->where('status', 'approved')->count(),
            'rejected' => Pengajuan::where('user_id', $user->id)->where('status', 'rejected')->count(),
        ];

        // Get recent submissions
        $recentSubmissions = Pengajuan::with(['batch'])
            ->where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($pengajuan) {
                return [
                    'id' => $pengajuan->id,
                    'batch' => [
                        'name' => $pengajuan->batch->name
                    ],
                    'status' => $pengajuan->status,
                    'created_at' => $pengajuan->created_at,
                    'updated_at' => $pengajuan->updated_at,
                ];
            });

        return Inertia::render('Mahasiswa/DashboardPage', [
            'stats' => $stats,
            'recentSubmissions' => $recentSubmissions
        ]);
    }
}
