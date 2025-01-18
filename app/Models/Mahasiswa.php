<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mahasiswa extends Model
{
    protected $table = 'mahasiswas';
    public $timestamps = false;
    protected $fillable = [
        'user_id',
        'student_id',
        'university_name',
        'faculty',
        'study_program',
        'current_semester',

    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
