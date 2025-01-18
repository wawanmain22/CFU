<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
    
class ProfileController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Staff/ProfilePage', [
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }
}
