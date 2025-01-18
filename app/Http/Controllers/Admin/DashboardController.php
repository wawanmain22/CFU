<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Response;


class DashboardController extends Controller
{
    public function index():Response
    {
        return Inertia::render('Admin/DashboardPage');
    }
}
