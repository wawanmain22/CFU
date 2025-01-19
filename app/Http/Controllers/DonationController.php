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
use Midtrans\SnapBi;
use DateTime;

class DonationController extends Controller
{
    public function __construct()
    {
        // Set midtrans configuration
        Config::$serverKey = config('midtrans.private_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    public function index(): Response
    {
        return Inertia::render('Donation');
    }

    public function store(Request $request)
    {
        // Validate request
        $request->validate([
            'amount' => 'required|numeric|min:10000',
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'description' => 'nullable|string',
        ]);

        try {
            // Set timezone dan generate donation code
            date_default_timezone_set('Asia/Jakarta');
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
            ]);

            // Prepare customer details
            $customer_details = [
                'first_name' => $donation->name,
                'email' => $donation->email,
                'phone' => $donation->phone,
            ];

            // Prepare transaction details
            $transaction_details = [
                'order_id' => $donation->donation_code,
                'gross_amount' => (int) $donation->amount,
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
                'enabled_payments' => [
                    'gopay', 'shopeepay', 'dana',  // Direct Debit (E-wallet)
                    'bank_transfer',                // Virtual Account
                    'cstore',                       // Over The Counter
                    'qris'                         // QRIS
                ],
                'payment_options' => [
                    'bank_transfer' => [
                        'banks' => ['bca', 'bni', 'bri', 'mandiri']
                    ]
                ],
                'cstore' => [
                    'alfamart' => [
                        'payment_code' => 'yes',  // Enable payment code generation
                        'merchant_id' => config('midtrans.merchant_id', ''),  // Add merchant ID from config
                        'message' => 'Tunjukkan kode pembayaran ini ke kasir'
                    ]
                ],
                'custom_field1' => 'Donasi untuk Mahasiswa',
                'custom_field2' => $donation->donation_code,
                'custom_field3' => date('Y-m-d H:i:s')
            ];

            // Get Snap Payment Page URL
            $snapToken = Snap::getSnapToken($payload);
            
            // Save snap token
            $donation->update([
                'snap_token' => $snapToken
            ]);

            // Return snap token
            return response()->json([
                'status' => 'success',
                'snap_token' => $snapToken,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function callback(Request $request)
    {
        Log::info('Midtrans Notification received at: ' . now());
        Log::info('Request Headers:', $request->headers->all());
        Log::info('Request Body:', $request->all());
        
        try {
            $serverKey = config('midtrans.private_key');
            $hashed = hash("sha512", $request->order_id . $request->status_code . $request->gross_amount . $serverKey);

            Log::info('Calculated Hash:', [
                'order_id' => $request->order_id,
                'status_code' => $request->status_code,
                'gross_amount' => $request->gross_amount,
                'calculated_hash' => $hashed,
                'received_signature' => $request->signature_key
            ]);

            if ($hashed == $request->signature_key) {
                $donation = Donation::where('donation_code', $request->order_id)->first();
                
                if ($donation) {
                    Log::info('Updating donation status:', [
                        'donation_code' => $request->order_id,
                        'transaction_status' => $request->transaction_status,
                        'payment_type' => $request->payment_type
                    ]);

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
                        'payment_info' => json_encode($request->all())
                    ]);

                    Log::info('Donation status updated successfully');

                    return response()->json([
                        'status' => 'success',
                        'message' => 'Payment notification processed successfully'
                    ]);
                }

                Log::error('Donation not found:', ['order_id' => $request->order_id]);
            } else {
                Log::error('Invalid signature:', [
                    'received' => $request->signature_key,
                    'calculated' => $hashed
                ]);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Invalid signature or donation not found'
            ], 400);

        } catch (\Exception $e) {
            Log::error('Error processing notification:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error processing notification: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getStatus($donation_code)
    {
        try {
            $donation = Donation::where('donation_code', $donation_code)->firstOrFail();
            
            // Get transaction status from Midtrans
            $status = \Midtrans\Transaction::status($donation_code);
            
            return response()->json([
                'status' => 'success',
                'data' => $status
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function cancel($donation_code)
    {
        try {
            $donation = Donation::where('donation_code', $donation_code)->firstOrFail();
            
            // Cancel transaction in Midtrans
            $cancel = \Midtrans\Transaction::cancel($donation_code);
            
            // Update donation status
            $donation->update([
                'status' => 'cancelled',
                'payment_info' => json_encode($cancel)
            ]);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Transaction cancelled successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
