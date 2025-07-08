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
                'name' => 'Super Admin',
                'email' => 'super@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'phone' => '1234567890',
                'photo' => 'user_photos\/default-user_profile.jpg',
                'identity' => 'admin_identity',
                'role' => 'superadmin',
                'created_at' => now(),
            ],
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('qwerty123'),
                'phone' => '1234567890',
                'photo' => 'user_photos\/default-user_profile.jpg',
                'identity' => 'admin_identity',
                'role' => 'admin',
                'created_at' => now(),
            ],
            [
                'name' => 'External User',
                'email' => 'external@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('qwerty123'),
                'phone' => '1234567891',
                'photo' => 'user_photos\/default-user_profile.jpg',
                'identity' => 'external_identity',
                'role' => 'external',
                'created_at' => now(),
            ],
            [
                'name' => 'Internal User',
                'email' => 'internal@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('qwerty123'),
                'phone' => '1234567892',
                'photo' => 'user_photos\/default-user_profile.jpg',
                'identity' => 'internal_identity',
                'role' => 'internal',
                'created_at' => now(),
            ],
            [
                'name' => 'Athallah Tsany Satriyaji',
                'email' => 'external@demo.com',
                'email_verified_at' => now(),
                'password' => Hash::make('qwerty123'),
                'phone' => '085375502733',
                'photo' => 'user_photos\/default-user_profile.jpg',
                'identity' => 'external_identity',
                'role' => 'external',
                'created_at' => now()->subDays(180),
            ],
            [
                'name' => 'Bintang Putra Akbar',
                'email' => 'internal@demo.com',
                'email_verified_at' => now(),
                'password' => Hash::make('qwerty123'),
                'phone' => '081326804033',
                'photo' => 'user_photos\/default-user_profile.jpg',
                'identity' => 'internal_identity',
                'role' => 'internal',
                'created_at' => now()->subDays(180),
            ]
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
