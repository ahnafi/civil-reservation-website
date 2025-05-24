<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class MakeFilamentUserWithSuperAdminRole extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:filament-superadmin-user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new Filament user with superadmin role';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->ask('Name');
        $email = $this->ask('Email');
        $password = $this->secret('Password');

        User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'superadmin',
            'email_verified_at' => now(),
        ]);

        $this->info("Filament user $email created with admin role.");
    }
}
