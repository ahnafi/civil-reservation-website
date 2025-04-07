<?php

namespace Database\Seeders;

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
            ],
            [
                "name" => "Uji Kualitas Air Komprehensif",
                "price" => 800000,
                "description" => "Paket pemeriksaan ini dilakukan untuk mengetahui kualitas air secara menyeluruh."
            ],
            [
                "name" => "Uji Kekuatan Beton dan Baja",
                "price" => 1200000,
                "description" => "Paket pemeriksaan ini dilakukan untuk mengetahui kekuatan beton dan baja."
            ],
            [
                "name" => "Pemetaan Geologi dan Hidrologi",
                "price" => 1500000,
                "description" => "Paket pemeriksaan ini dilakukan untuk mengetahui kondisi geologi dan hidrologi suatu area."
            ],
            [
                "name" => "Uji Mekanika Tanah Lengkap",
                "price" => 1000000,
                "description" => "Paket pemeriksaan ini dilakukan untuk mengetahui berbagai macam sifat mekanika tanah."
            ]
        ];

        foreach ($packages as $package) {
            Package::create($package);
        }
    }
}
