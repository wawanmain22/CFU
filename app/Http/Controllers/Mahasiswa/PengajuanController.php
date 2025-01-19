<?php

namespace App\Http\Controllers\Mahasiswa;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Pengajuan;
use App\Models\Batch;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class PengajuanController extends Controller
{
    public function index():Response
    {
        // Ambil batch terakhir
        $latestBatch = Batch::latest('created_at')->first();
        
        // Cek apakah user sudah pernah mengajukan di batch ini
        $hasSubmitted = false;
        if ($latestBatch) {
            $hasSubmitted = Pengajuan::where('user_id', Auth::id())
                ->where('batch_id', $latestBatch->id)
                ->exists();
        }

        // Status bisa submit: batch masih open DAN belum pernah submit di batch ini
        $canSubmit = $latestBatch 
            && $latestBatch->status === 'open' 
            && !$hasSubmitted;
        
        return Inertia::render('Mahasiswa/PengajuanPage', [
            'canSubmit' => $canSubmit,
            'currentBatch' => $latestBatch,
            'hasSubmitted' => $hasSubmitted
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'dokumen_pengajuan' => 'required|file|mimes:pdf',
            'batch_id' => 'required|exists:batches,id',
            'note_user' => 'required|string|max:255',
        ]);

        $pengajuan = Pengajuan::create([
            'user_id' => $request->user()->id,
            'batch_id' => $request->batch_id,
            'dokumen_pengajuan' => $request->file('dokumen_pengajuan')->store('pengajuans', 'local'),
            'note_user' => $request->note_user,
            'status' => 'pending',
            'created_at' => now(),
        ]);

        return back()->with('success', 'Pengajuan berhasil dibuat');
    }
}
