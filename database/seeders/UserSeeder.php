<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('qwerty123'),
                'phone' => '1234567890',
                'identity' => 'admin_identity',
                'role' => 'admin',
                'created_at' => now(),
            ],
            [
                'name' => 'External User',
                'email' => 'external@example.com',
                'password' => Hash::make('qwerty123'),
                'phone' => '1234567891',
                'identity' => 'external_identity',
                'role' => 'external',
                'created_at' => now(),
            ],
            [
                'name' => 'Internal User',
                'email' => 'internal@example.com',
                'password' => Hash::make('qwerty123'),
                'phone' => '1234567892',
                'identity' => 'internal_identity',
                'role' => 'internal',
                'created_at' => now(),
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
