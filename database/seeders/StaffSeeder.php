<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Staff;
use Illuminate\Support\Facades\Hash;

class StaffSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Staff 1 - Admin
        $admin = User::create([
            'name' => 'Admin Staff',
            'email' => 'admin@cfu.com',
            'password' => Hash::make('Admin123!'),
            'birthdate' => '1990-01-15',
            'gender' => 'male',
            'phone' => '081234567890',
            'religion' => 'islam',
            'address' => 'Jl. Admin No. 1, Jakarta',
            'role' => 'staff',
            'created_at' => now(),
        ]);

        Staff::create([
            'user_id' => $admin->id,
            'position' => 'Administrator',
            'department' => 'Administration',
            'employee_id' => 'STAFF-001'
        ]);

        // Staff 2 - Finance
        $finance = User::create([
            'name' => 'Finance Staff',
            'email' => 'finance@cfu.com',
            'password' => Hash::make('Finance123!'),
            'birthdate' => '1992-05-20',
            'gender' => 'female',
            'phone' => '081234567891',
            'religion' => 'christian',
            'address' => 'Jl. Finance No. 2, Jakarta',
            'role' => 'staff',
            'created_at' => now(),
        ]);

        Staff::create([
            'user_id' => $finance->id,
            'position' => 'Finance Officer',
            'department' => 'Finance',
            'employee_id' => 'STAFF-002'
        ]);

        // Staff 3 - Support
        $support = User::create([
            'name' => 'Support Staff',
            'email' => 'support@cfu.com',
            'password' => Hash::make('Support123!'),
            'birthdate' => '1995-08-10',
            'gender' => 'male',
            'phone' => '081234567892',
            'religion' => 'islam',
            'address' => 'Jl. Support No. 3, Jakarta',
            'role' => 'staff',
            'created_at' => now(),
        ]);

        Staff::create([
            'user_id' => $support->id,
            'position' => 'Support Officer',
            'department' => 'Customer Support',
            'employee_id' => 'STAFF-003'
        ]);
    }
}
