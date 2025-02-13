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
        Schema::create('pengajuans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('batch_id')->constrained('batches');
            $table->string('dokumen_pengajuan');
            $table->text('note_user');
            $table->text('note_reviewer')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected']);
            $table->integer('reviewer_id')->nullable();
            $table->string('dokumen_approved')->nullable();
            $table->string('foto_dokumentasi_approved')->nullable();
            $table->timestamp('created_at');
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengajuans');
    }
};
