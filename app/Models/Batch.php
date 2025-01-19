<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Batch extends Model
{
    protected $table = 'batches';
    public $timestamps = false;
    protected $fillable = [
        'name',
        'status',
        'created_at',
        'updated_at'
    ];

    public function pengajuans()
    {
        return $this->hasMany(Pengajuan::class);
    }
}
