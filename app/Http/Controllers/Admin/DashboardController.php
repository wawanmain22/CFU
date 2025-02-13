<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Donation;
use App\Models\Pengajuan;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index():Response
    {
        // Get statistics
        $stats = [
            'total_pengajuan' => Pengajuan::count(),
            'pending_pengajuan' => Pengajuan::where('status', 'pending')->count(),
            'approved_pengajuan' => Pengajuan::where('status', 'approved')->count(),
            'total_donasi' => Donation::where('status', 'success')->sum('amount'),
            'total_donatur' => Donation::where('status', 'success')->count(),
        ];

        // Get recent donations
        $recentDonations = Donation::where('status', 'success')
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

        // Get donation trends for the last 7 days
        $donationTrends = Donation::where('status', 'success')
            ->where('created_at', '>=', Carbon::now()->subDays(6))
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('Y-m-d'),
                    'count' => $item->count,
                ];
            });

        return Inertia::render('Admin/DashboardPage', [
            'stats' => $stats,
            'recentDonations' => $recentDonations,
            'donationTrends' => $donationTrends,
        ]);
    }
}
