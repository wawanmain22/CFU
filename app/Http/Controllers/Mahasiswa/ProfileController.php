<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
class ProfileController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();
        $mahasiswa = $user->mahasiswa;

        return Inertia::render('Mahasiswa/ProfilePage', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'gender' => $user->gender,
                    'religion' => $user->religion,
                    'birthdate' => $user->birthdate,
                    'address' => $user->address,
                    'role' => $user->role,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ],
                'mahasiswa' => [
                    'nim' => $mahasiswa->student_id,
                    'university_name' => $mahasiswa->university_name,
                    'faculty' => $mahasiswa->faculty,
                    'study_program' => $mahasiswa->study_program,
                    'current_semester' => $mahasiswa->current_semester,
                ]
            ]
        ]);
    }

    public function updatePhone(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string', 'max:20'],
        ]);

        /** @var User $user */
        $user = Auth::user();
        $user->fill([
            'phone' => $validated['phone']
        ])->save();

        return back()->with('success', 'Phone number updated successfully');
    }

    public function updateAddress(Request $request)
    {
        $validated = $request->validate([
            'address' => ['required', 'string', 'max:255'],
        ]);

        /** @var User $user */
        $user = Auth::user();
        $user->fill([
            'address' => $validated['address']
        ])->save();

        return back()->with('success', 'Address updated successfully');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'new_password' => ['required', Password::defaults(), 'confirmed'],
            'new_password_confirmation' => ['required'],
        ]);

        /** @var User $user */
        $user = Auth::user();
        $user->fill([
            'password' => Hash::make($validated['new_password'])
        ])->save();

        return back()->with('success', 'Password updated successfully');
    }


    
}

