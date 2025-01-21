<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Donation;
use App\Models\Pengajuan;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index():Response
    {
        // Get statistics
        $stats = [
            'total_pengajuan' => Pengajuan::count(),
            'pending_pengajuan' => Pengajuan::where('status', 'pending')->count(),
            'approved_pengajuan' => Pengajuan::where('status', 'approved')->count(),
            'total_donasi' => Donation::where('status', 'settlement')->sum('amount'),
            'total_donatur' => Donation::where('status', 'settlement')->count(),
        ];

        // Get recent donations
        $recentDonations = Donation::where('status', 'settlement')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($donation) {
                return [
                    'id' => $donation->id,
                    'name' => $donation->name,
                    'amount' => $donation->amount,
                    'message' => $donation->message,
                    'created_at' => $donation->created_at,
                ];
            });

        return Inertia::render('Admin/DashboardPage', [
            'stats' => $stats,
            'recentDonations' => $recentDonations,
        ]);
    }
}
