<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Pengajuan;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PengajuanController extends Controller
{
    public function index():Response
    {
        $pengajuans = Pengajuan::with(['user', 'batch'])
            ->latest()
            ->get()
            ->map(function ($pengajuan) {
                return [
                    'id' => $pengajuan->id,
                    'user' => [
                    'name' => $pengajuan->user->name,
                    'email' => $pengajuan->user->email,
                    'birthdate' => $pengajuan->user->birthdate,
                    'gender' => $pengajuan->user->gender,
                    'phone' => $pengajuan->user->phone,
                    'religion' => $pengajuan->user->religion,
                    'address' => $pengajuan->user->address,
                    'mahasiswa' => $pengajuan->user->mahasiswa ? [
                        'student_id' => $pengajuan->user->mahasiswa->student_id,
                        'university_name' => $pengajuan->user->mahasiswa->university_name,
                        'faculty' => $pengajuan->user->mahasiswa->faculty,
                        'study_program' => $pengajuan->user->mahasiswa->study_program,
                        'current_semester' => $pengajuan->user->mahasiswa->current_semester,
                    ] : null,
                ],
                    'batch' => [
                        'name' => $pengajuan->batch->name,
                    ],
                    'status' => $pengajuan->status,
                    'created_at' => $pengajuan->created_at,
                    'note_user' => $pengajuan->note_user,
                ];
            });

        return Inertia::render('Admin/PengajuanPage', [
            'pengajuans' => $pengajuans
        ]);
    }

    public function update(Pengajuan $pengajuan, Request $request)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'note_reviewer' => 'required|string',
            'dokumen_approved' => $request->status === 'approved' ? 'required|file|mimes:pdf' : 'nullable',
            'foto_dokumentasi_approved' => $request->status === 'approved' ? 'required|image' : 'nullable'
        ]);
    
        $data = [
            'status' => $request->status,
            'note_reviewer' => $request->note_reviewer,
            'reviewer_id' => Auth::id(),
            'updated_at' => now()
        ];
    
        if ($request->status === 'approved') {
            $data['dokumen_approved'] = $request->file('dokumen_approved')->store('pengajuans/approved', 'local');
            $data['foto_dokumentasi_approved'] = $request->file('foto_dokumentasi_approved')->store('pengajuans/dokumentasi', 'local');
        }
    
        $pengajuan->update($data);
    
        $action = $request->status === 'approved' ? 'disetujui' : 'ditolak';
        return back()->with('success', "Pengajuan berhasil {$action}");
    }

    public function show(Pengajuan $pengajuan): array
    {
        $pengajuan->load(['user.mahasiswa', 'batch', 'reviewer']);
        
        return [
            'pengajuan' => [
                'id' => $pengajuan->id,
                'user' => [
                    'name' => $pengajuan->user->name,
                    'email' => $pengajuan->user->email,
                    'birthdate' => $pengajuan->user->birthdate,
                    'gender' => $pengajuan->user->gender,
                    'phone' => $pengajuan->user->phone,
                    'religion' => $pengajuan->user->religion,
                    'address' => $pengajuan->user->address,
                    'mahasiswa' => $pengajuan->user->mahasiswa ? [
                        'student_id' => $pengajuan->user->mahasiswa->student_id,
                        'university_name' => $pengajuan->user->mahasiswa->university_name,
                        'faculty' => $pengajuan->user->mahasiswa->faculty,
                        'study_program' => $pengajuan->user->mahasiswa->study_program,
                        'current_semester' => $pengajuan->user->mahasiswa->current_semester,
                    ] : null,
                ],
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
                'reviewed_by' => $pengajuan->reviewer ? $pengajuan->reviewer->name : null,
            ]
        ];
    }

    public function downloadFile(Pengajuan $pengajuan, string $type)
    {
        // Validasi akses
        if (!Auth::user()->role === 'staff') {
            abort(403);
        }

        // Tentukan file path berdasarkan type
        $filePath = match($type) {
            'dokumen_pengajuan' => $pengajuan->dokumen_pengajuan,
            'dokumen_approved' => $pengajuan->dokumen_approved,
            'foto_dokumentasi' => $pengajuan->foto_dokumentasi_approved,
            default => abort(404)
        };

        // Pastikan file ada
        if (!Storage::exists($filePath)) {
            abort(404);
        }

        return Storage::response($filePath);
    }
}
    