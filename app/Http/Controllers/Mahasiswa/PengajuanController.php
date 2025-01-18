<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengajuanController extends Controller
{
    public function index():Response
    {
        return Inertia::render('Mahasiswa/PengajuanPage');
    }
}
