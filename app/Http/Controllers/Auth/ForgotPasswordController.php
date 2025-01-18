<?php

namespace App\Http\Controllers\Auth;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use Illuminate\Support\Facades\Log;


class ForgotPasswordController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    public function store(Request $request)
    {
        try {
            Log::info('Password reset requested for email: ' . $request->email);
            
            $request->validate([
                'email' => 'required|email',
            ]);

            // Check if email exists in users table
            $user = User::where('email', $request->email)->first();
            if (!$user) {
                Log::warning('Email not found: ' . $request->email);
                return back()->withErrors([
                    'email' => 'We could not find a user with that email address.'
                ]);
            }

            $token = Str::random(64);
            
            Log::info('Creating password reset token', ['email' => $request->email, 'token' => $token]);
            
            DB::table('password_resets')->insert([
                'email' => $request->email,
                'token' => $token,
                'created_at' => now(),
            ]);

            try {
                Log::info('Attempting to send password reset email');
                Mail::send('emails.password-reset', ['token' => $token], function ($message) use ($request) {
                    $message->to($request->email);
                    $message->subject('Reset Password');
                });
                Log::info('Password reset email sent successfully');
                return back()->with('success', 'We have emailed your password reset link. Please check your inbox.');
            } catch (\Exception $e) {
                Log::error('Failed to send password reset email', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                return back()->withErrors([
                    'email' => 'Failed to send password reset email. Please try again later.'
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Password reset process failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors([
                'email' => 'An error occurred. Please try again later.'
            ]);
        }
    }

    public function indexForm($token){
        $passwordReset = DB::table('password_resets')
            ->where('token', $token)
            ->first();

        if (!$passwordReset) {
            return redirect()->route('password.request')->withErrors([
                'email' => 'Invalid or expired password reset link.'
            ]);
        }

        return Inertia::render('Auth/FormResetPassword', [
            'token' => $token,
            'email' => $passwordReset->email
        ]);
    }

    public function updatePassword(Request $request)
    {
        try {
            Log::info('Starting password update process', [
                'email' => $request->email
            ]);

            $request->validate([
                'email' => 'required|email|exists:users,email',
                'password' => [
                    'required',
                    'min:8',
                    'regex:/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/',
                ],
                'password_confirmation' => 'required|same:password',
                'token' => 'required'
            ], [
                'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.',
            ]);

            $updatePassword = DB::table('password_resets')
                ->where(['email' => $request->email, 'token' => $request->token])
                ->first();

            if (!$updatePassword) {
                Log::warning('Invalid or expired reset token', [
                    'email' => $request->email,
                    'token' => $request->token
                ]);
                return back()->withErrors([
                    'email' => 'Invalid or expired password reset link.'
                ]);
            }

            // Check if token is expired (60 minutes)
            if (now()->diffInMinutes($updatePassword->created_at) > 60) {
                Log::warning('Expired reset token', [
                    'email' => $request->email,
                    'token_created_at' => $updatePassword->created_at
                ]);
                DB::table('password_resets')->where('email', $request->email)->delete();
                return back()->withErrors([
                    'email' => 'Password reset link has expired. Please request a new one.'
                ]);
            }

            Log::info('Updating password', [
                'email' => $request->email
            ]);

            $user = User::where('email', $request->email)
                ->update(['password' => Hash::make($request->password)]);

            DB::table('password_resets')->where('email', $request->email)->delete();

            Log::info('Password updated successfully', [
                'email' => $request->email
            ]);

            return Inertia::render('Auth/FormResetPassword', [
                'token' => $request->token,
                'email' => $request->email,
                'flash' => [
                    'success' => 'Password has been reset successfully! You can now login with your new password.'
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Password update failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'email' => $request->email ?? 'not provided'
            ]);
            return back()->withErrors([
                'email' => 'Failed to update password. Please try again.'
            ]);
        }
    }

    
}

