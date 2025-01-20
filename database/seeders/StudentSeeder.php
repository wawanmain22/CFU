<?php

namespace Database\Seeders;

use App\Models\Mahasiswa;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Student 1
        $student = User::create([
            'name' => 'Student 1',
            'email' => 'student1@cfu.com',
            'password' => Hash::make('Student123!'),
            'birthdate' => '1990-01-15',
            'gender' => 'male',
            'phone' => '081234567890',
            'religion' => 'Islam',
            'address' => 'Jl. Admin No. 1, Jakarta',
            'role' => 'student',
            'created_at' => now(),
        ]);

        Mahasiswa::create([
            'user_id' => $student->id,
            'student_id' => '1234567890',
            'university_name' => 'Universitas Indonesia',
            'faculty' => 'Fakultas Ilmu Komputer',
            'study_program' => 'Teknik Informatika',
            'current_semester' => '1'
        ]);

        // Student 2
        $student2 = User::create([
            'name' => 'Student 2',
            'email' => 'student2@cfu.com',
            'password' => Hash::make('Student123!'),
            'birthdate' => '1992-03-20',
            'gender' => 'female',
            'phone' => '081234567891',
            'religion' => 'Kristen',
            'address' => 'Jl. Mahasiswa No. 2, Jakarta',
            'role' => 'student',
            'created_at' => now(),
        ]);

        Mahasiswa::create([
            'user_id' => $student2->id,
            'student_id' => '1234567891',
            'university_name' => 'Institut Teknologi Bandung',
            'faculty' => 'Fakultas Teknik Elektro',
            'study_program' => 'Teknik Elektro',
            'current_semester' => '3'
        ]);

        // Student 3
        $student3 = User::create([
            'name' => 'Student 3',
            'email' => 'student3@cfu.com',
            'password' => Hash::make('Student123!'),
            'birthdate' => '1993-07-10',
            'gender' => 'male',
            'phone' => '081234567892',
            'religion' => 'Islam',
            'address' => 'Jl. Mahasiswa No. 3, Jakarta',
            'role' => 'student',
            'created_at' => now(),
        ]);

        Mahasiswa::create([
            'user_id' => $student3->id,
            'student_id' => '1234567892',
            'university_name' => 'Universitas Gadjah Mada',
            'faculty' => 'Fakultas MIPA',
            'study_program' => 'Ilmu Komputer',
            'current_semester' => '5'
        ]);
    }
}
