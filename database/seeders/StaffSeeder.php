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
            'name' => 'Ridwan',
            'email' => 'ridwan@cfu.com',
            'password' => Hash::make('@Ridwan123'),
            'birthdate' => '1990-01-15',
            'gender' => 'male',
            'phone' => '081234567890',
            'religion' => 'Islam',
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
            'name' => 'Faris',
            'email' => 'faris@cfu.com',
            'password' => Hash::make('@Faris123'),
            'birthdate' => '1992-05-20',
            'gender' => 'female',
            'phone' => '081234567891',
            'religion' => 'Islam',
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
            'name' => 'Darwan',
            'email' => 'darwan@cfu.com',
            'password' => Hash::make('@Darwan123'),
            'birthdate' => '1995-08-10',
            'gender' => 'male',
            'phone' => '081234567892',
            'religion' => 'Islam',
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

        // Staff 4 - Marketing
        $marketing = User::create([
            'name' => 'Angga',
            'email' => 'angga@cfu.com',
            'password' => Hash::make('@Angga123'),
            'birthdate' => '1993-03-18',
            'gender' => 'male',
            'phone' => '081234567893',
            'religion' => 'Islam',
            'address' => 'Jl. Marketing No. 4, Jakarta',
            'role' => 'staff',
            'created_at' => now(),
        ]);

        Staff::create([
            'user_id' => $marketing->id,
            'position' => 'Marketing Officer',
            'department' => 'Marketing',
            'employee_id' => 'STAFF-004'
        ]);

        // Staff 5 - IT
        $it = User::create([
            'name' => 'Fadly',
            'email' => 'fadly@cfu.com',
            'password' => Hash::make('@Fadly123'),
            'birthdate' => '1993-03-18',
            'gender' => 'male',
            'phone' => '081234567894',
            'religion' => 'Islam',
            'address' => 'Jl. IT No. 5, Jakarta',
            'role' => 'staff',
            'created_at' => now(),
        ]);

        Staff::create([
            'user_id' => $it->id,
            'position' => 'IT Officer',
            'department' => 'IT',
            'employee_id' => 'STAFF-005'
        ]);

        // Staff 6 - HR
        $hr = User::create([
            'name' => 'Dhika',
            'email' => 'dhika@cfu.com',
            'password' => Hash::make('@Dhika123'),
            'birthdate' => '1993-03-18',
            'gender' => 'male',
            'phone' => '081234567895',
            'religion' => 'Islam',
            'address' => 'Jl. HR No. 6, Jakarta',
            'role' => 'staff',
            'created_at' => now(),
        ]);

        Staff::create([
            'user_id' => $hr->id,
            'position' => 'HR Officer',
            'department' => 'HR',
            'employee_id' => 'STAFF-006'
        ]);
    }
}
