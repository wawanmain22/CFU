<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    protected $table = 'staff';
    public $timestamps = false;
    protected $fillable = [
        'user_id',
        'position',
        'department',
        'employee_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
