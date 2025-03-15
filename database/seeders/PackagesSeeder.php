<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Package;

class PackagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = [
            [
                "name" => "Uji Material Pasir Lengkap",
                "price" => 600000,
                "description" => "Paket pemeriksaan ini dilakukan untuk mengetahui berbagai macam sifat pasir."
            ]
        ];

        foreach ($packages as $package) {
            Package::create($package);
        }
    }
}
