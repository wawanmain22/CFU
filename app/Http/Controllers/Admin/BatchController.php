<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
// use Illuminate\Support\Facades\Log;
    
class BatchController extends Controller
{
    public function index():Response
    {
        $batches = Batch::orderBy('id', 'desc')->get();
        // Log::info('Batch data:', $batches->toArray());
        return Inertia::render('Admin/BatchPage', [
            'batches' => $batches
        ]);
    }

    public function store(Request $request)
    {
        // Check if there's any open batch
        $openBatch = Batch::where('status', 'open')->first();
        if ($openBatch) {
            return redirect()->back()->with('error', 'Tidak bisa membuat batch baru karena ada batch yang masih terbuka');
        }

        // Get the latest batch to determine next batch number
        $latestBatch = Batch::orderBy('id', 'desc')->first();
        
        // If no batch exists, start with "Batch 1", otherwise increment the last batch number
        if (!$latestBatch) {
            $batchNumber = 1;
        } else {
            // Extract number from batch name (assuming format "Batch X")
            $lastNumber = (int) str_replace('Batch ', '', $latestBatch->name);
            $batchNumber = $lastNumber + 1;
        }

        $batch = Batch::create([
            'name' => "Batch {$batchNumber}",
            'status' => 'open',
            'created_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Batch berhasil dibuat');
    }

    public function update(Request $request, Batch $batch)
    {
        $batch->update([
            'status' => 'closed',
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Batch berhasil ditutup');
    }
}
