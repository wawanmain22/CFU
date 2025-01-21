<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Donation;
use App\Models\Pengajuan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function index()
    {
        $donations = Donation::where('status', 'success')
            ->orderBy('created_at', 'desc')
            ->take(50)
            ->get(['name', 'email', 'phone', 'amount', 'description', 'created_at']);

        $batches = Batch::orderBy('created_at', 'desc')->get(['id', 'name']);
        
        $pengajuans = Pengajuan::with(['user:id,name', 'batch:id,name'])
            ->where('status', 'approved')
            ->whereNotNull('foto_dokumentasi_approved')
            ->orderBy('created_at', 'desc')
            ->get(['id', 'user_id', 'batch_id', 'foto_dokumentasi_approved'])
            ->map(function ($pengajuan) {
                $pengajuan->foto_dokumentasi_approved = Storage::url($pengajuan->foto_dokumentasi_approved);
                return $pengajuan;
            });

        return Inertia::render('Index', [
            'donations' => $donations,
            'batches' => $batches,
            'pengajuans' => $pengajuans,
        ]);
    }
}
