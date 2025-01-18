<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\Mahasiswa;


class RegisterController extends Controller
{
    public function index():Response
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request)
    {
        try {
            Log::info('Registration attempt', $request->all());
            
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:'.User::class,
                'password' => [
                    'required',
                    'confirmed',
                    'min:8',
                    'regex:/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/'
                ],
                'birthdate' => 'required|date',
                'gender' => 'required|in:male,female',
                'phone' => 'required|string|max:15',
                'religion' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'student_id' => 'required|string|max:255',
                'university_name' => 'required|string|max:255',
                'faculty' => 'required|string|max:255',
                'study_program' => 'required|string|max:255',
                'current_semester' => 'required|numeric|min:1|max:14',
            ], [
                'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.',
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'birthdate' => $request->birthdate,
                'gender' => strtolower($request->gender),
                'phone' => $request->phone,
                'religion' => $request->religion,
                'address' => $request->address,
                'role' => 'student',
                'created_at' => now(),
            ]);

            $mahasiswa = Mahasiswa::create([
                'user_id' => $user->id,
                'student_id' => $request->student_id,
                'university_name' => $request->university_name,
                'faculty' => $request->faculty,
                'study_program' => $request->study_program,
                'current_semester' => $request->current_semester,
            ]);

            Log::info('Registration successful', ['user_id' => $user->id]);

            return Inertia::render('Auth/Register', [
                'flash' => [
                    'success' => 'Registration successful! You can now login with your credentials.'
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Registration failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors([
                'error' => 'Registration failed: ' . $e->getMessage()
            ]);
        }
    }
    
}
