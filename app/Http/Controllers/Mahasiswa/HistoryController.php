<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Batch;
use App\Models\Pengajuan;
use Illuminate\Support\Facades\Storage;

class HistoryController extends Controller
{
    public function index(): Response
    {
        /** @var User $user */
        $user = Auth::user();
        $pengajuans = Pengajuan::where('user_id', $user->id)
            ->with(['batch'])
            ->latest()
            ->get()
            ->map(function ($pengajuan) {
                return [
                    'id' => $pengajuan->id,
                    'batch' => [
                        'name' => $pengajuan->batch->name,
                    ],
                    'status' => $pengajuan->status,
                    'created_at' => $pengajuan->created_at,
                    'updated_at' => $pengajuan->updated_at,
                    'note_user' => $pengajuan->note_user,
                ];
            });

        return Inertia::render('Mahasiswa/HistoryPage', [
            'pengajuans' => $pengajuans
        ]);
    }

    public function show(Pengajuan $pengajuan): array
    {
        // Validasi akses
        if ($pengajuan->user_id !== Auth::id()) {
            abort(403);
        }

        $pengajuan->load(['batch', 'reviewer']);
        
        return [
            'pengajuan' => [
                'id' => $pengajuan->id,
                'batch' => [
                    'name' => $pengajuan->batch->name,
                ],
                'dokumen_pengajuan' => $pengajuan->dokumen_pengajuan,
                'note_user' => $pengajuan->note_user,
                'note_reviewer' => $pengajuan->note_reviewer,
                'status' => $pengajuan->status,
                'dokumen_approved' => $pengajuan->dokumen_approved,
                'foto_dokumentasi_approved' => $pengajuan->foto_dokumentasi_approved,
                'created_at' => $pengajuan->created_at,
                'updated_at' => $pengajuan->updated_at,
                'reviewer' => $pengajuan->reviewer ? [
                    'name' => $pengajuan->reviewer->name,
                ] : null,
            ]
        ];
    }

    public function downloadFile(Pengajuan $pengajuan, string $type)
    {
        // Validasi akses
        if ($pengajuan->user_id !== Auth::id()) {
            abort(403);
        }

        // Untuk foto dokumentasi, gunakan public storage
        if ($type === 'foto_dokumentasi') {
            $filePath = $pengajuan->foto_dokumentasi_approved;
            if (!Storage::disk('public')->exists($filePath)) {
                abort(404);
            }
            return Storage::disk('public')->response($filePath);
        }

        // Untuk file lainnya gunakan local storage
        $filePath = match($type) {
            'dokumen_pengajuan' => $pengajuan->dokumen_pengajuan,
            'dokumen_approved' => $pengajuan->status === 'approved' ? $pengajuan->dokumen_approved : abort(403),
            default => abort(404)
        };

        // Pastikan file ada
        if (!Storage::exists($filePath)) {
            abort(404);
        }

        return Storage::response($filePath);
    }
}
