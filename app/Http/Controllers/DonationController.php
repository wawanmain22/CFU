<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Midtrans\Config;
use Midtrans\Snap;
use SnapBi\SnapBi;
use DateTime;

class DonationController extends Controller
{
    public function __construct()
    {
        // Set midtrans configuration
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;

        // Set SNAP BI Configuration
        \Midtrans\Config::$clientKey = config('midtrans.client_key');
        \Midtrans\Config::$serverKey = config('midtrans.server_key');
        \Midtrans\Config::$isProduction = config('midtrans.is_production');
        \Midtrans\Config::$isSanitized = true;
        \Midtrans\Config::$is3ds = true;
        \Midtrans\Config::$appendNotifUrl = config('midtrans.notification_url');
        \Midtrans\Config::$overrideNotifUrl = config('midtrans.notification_url');
    }

    public function index(): Response
    {
        return Inertia::render('Donation');
    }

    public function store(Request $request)
    {
        // Log::info('Starting donation process:', $request->all());

        // Validate request
        $request->validate([
            'amount' => 'required|numeric|min:10000',
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'description' => 'nullable|string',
        ]);

        try {
            // Generate donation code
            $donation_code = 'DON-' . time() . '-' . Str::random(5);
            
            // Create donation record
            $donation = Donation::create([
                'name' => $request->name ?: 'Anonymous',
                'email' => $request->email ?: 'anonymous@mail.com',
                'phone' => $request->phone ?: '081234567890',
                'amount' => $request->amount,
                'description' => $request->description,
                'donation_code' => $donation_code,
                'status' => 'pending',
                'created_at' => now(),
            ]);

            // Prepare transaction details
            $transaction_details = [
                'order_id' => $donation->donation_code,
                'gross_amount' => (int) $donation->amount,
            ];

            // Prepare customer details
            $customer_details = [
                'first_name' => $donation->name,
                'email' => $donation->email,
                'phone' => $donation->phone,
            ];

            // Prepare item details
            $item_details = [
                [
                    'id' => $donation->id,
                    'price' => (int) $donation->amount,
                    'quantity' => 1,
                    'name' => 'Donasi untuk Mahasiswa',
                    'brand' => 'CFU',
                    'category' => 'Donation',
                    'merchant_name' => 'Crowd Funding University',
                ]
            ];

            // Create Midtrans Payload
            $payload = [
                'transaction_details' => $transaction_details,
                'customer_details' => $customer_details,
                'item_details' => $item_details,
                'callbacks' => [
                    'finish' => route('donation.finish'),
                    'unfinish' => route('donation.unfinish'),
                    'error' => route('donation.error'),
                ],
            ];

            // Log::info('Requesting Snap token with payload:', $payload);

            // Get Snap Payment Page URL
            $snapToken = Snap::getSnapToken($payload);
            
            // Save snap token
            $donation->update([
                'snap_token' => $snapToken
            ]);

            return response()->json([
                'status' => 'success',
                'snap_token' => $snapToken,
            ]);

        } catch (\Exception $e) {
            // Log::error('Payment Creation Error:', [
            //     'message' => $e->getMessage(),
            //     'trace' => $e->getTraceAsString()
            // ]);

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function callback(Request $request)
    {
        // Log::info('Payment Notification received:', $request->all());

        try {
            // Handle regular Midtrans notification
            $donation = Donation::where('donation_code', $request->order_id)->first();
            
            if (!$donation) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Donation not found'
                ], 404);
            }

            // Update donation status
            $donation->update([
                'transaction_id' => $request->transaction_id,
                'payment_type' => $request->payment_type,
                'status' => match ($request->transaction_status) {
                    'capture', 'settlement' => 'success',
                    'pending' => 'pending',
                    'deny', 'cancel', 'failure' => 'failed',
                    'expire' => 'expired',
                    default => $donation->status,
                },
                'updated_at' => now(),
                'payment_info' => json_encode($request->all())
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Payment notification processed'
            ]);

        } catch (\Exception $e) {
            // Log::error('Error processing notification:', [
            //     'message' => $e->getMessage(),
            //     'trace' => $e->getTraceAsString()
            // ]);

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function handleDanaNotification(Request $request)
    {
        // Log::info('DANA Payment Notification received:', $request->all());

        try {
            $donation = Donation::where('donation_code', $request->originalPartnerReferenceNo)->first();
            
            if (!$donation) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Donation not found'
                ], 404);
            }

            // Update donation status
            $donation->update([
                'transaction_id' => $request->originalReferenceNo,
                'payment_type' => 'dana',
                'status' => match ($request->latestTransactionStatus) {
                    '00' => 'success',
                    '03' => 'pending',
                    '01', '02' => 'failed',
                    default => $donation->status,
                },
                'updated_at' => now(),
                'payment_info' => json_encode($request->all())
            ]);

            if ($donation->status === 'success') {
                return redirect()->route('donation.finish');
            }

            return response()->json([
                'status' => 'success',
                'message' => 'DANA notification processed'
            ]);

        } catch (\Exception $e) {
            // Log::error('Error processing DANA notification:', [
            //     'message' => $e->getMessage(),
            //     'trace' => $e->getTraceAsString()
            // ]);

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getStatus($donation_code)
    {
        try {
            $donation = Donation::where('donation_code', $donation_code)->firstOrFail();
            
            return response()->json([
                'status' => 'success',
                'data' => [
                    'status' => $donation->status,
                    'payment_type' => $donation->payment_type,
                    'amount' => $donation->amount,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function finishUrl(Request $request)
    {
        // Log::info('Payment Finish:', $request->all());
        
        return to_route('donation')
            ->with('success', 'Pembayaran berhasil! Terima kasih atas donasi Anda.');
    }

    public function unfinishUrl(Request $request)
    {
        // Log::info('Payment Unfinish:', $request->all());
        
        return to_route('donation')
            ->with('error', 'Pembayaran belum selesai. Silakan selesaikan pembayaran Anda.');
    }

    public function errorPaymentUrl(Request $request)
    {
        // Log::info('Payment Error:', $request->all());
        
        return to_route('donation')
            ->with('error', 'Pembayaran gagal. Silakan coba lagi.');
    }
}
