<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
    
class ProfileController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();
        $staff = $user->staff;

        return Inertia::render('Admin/ProfilePage', [
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
                'staff' => [
                    'employee_id' => $staff->employee_id,
                    'position' => $staff->position,
                    'department' => $staff->department,
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

        // Check if current password matches
        if (!Hash::check($validated['current_password'], $user->password)) {
            return back()->withErrors([
                'current_password' => 'The provided password does not match your current password.'
            ]);
        }

        $user->fill([
            'password' => Hash::make($validated['new_password'])
        ])->save();

        return back()->with('success', 'Password updated successfully');
    }
}
