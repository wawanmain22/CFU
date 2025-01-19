<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    protected $table = 'donations';

    public $timestamps = true;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'donation_code',
        'amount',
        'description',
        'snap_token',
        'transaction_id',
        'status',
        'payment_type',
        'payment_info',
        'created_at',
        'updated_at',
    ];
}
