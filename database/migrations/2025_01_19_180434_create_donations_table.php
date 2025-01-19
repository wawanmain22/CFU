<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            // Donor Information
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            
            // Donation Details
            $table->string('donation_code')->unique(); // untuk order_id di Midtrans
            $table->decimal('amount', 10, 2); // gross_amount di Midtrans
            $table->text('description')->nullable();
            
            // Midtrans Transaction Details
            $table->string('snap_token')->nullable();
            $table->string('payment_type')->nullable();
            $table->string('transaction_id')->nullable(); // dari Midtrans
            $table->enum('status', ['pending', 'success', 'failed', 'expired'])->default('pending');
            $table->json('payment_info')->nullable(); // menyimpan response dari Midtrans
            
            $table->timestamp('created_at');
            $table->timestamp('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
