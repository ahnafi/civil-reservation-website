<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Package;
use App\Models\Laboratory;

class PackagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $laboratories = Laboratory::pluck('id', 'code');

        $packages = [
            [
                "name" => "Uji Material Pasir Lengkap",
                "price" => 600000,
                "images" => ["package_images/ujiberatjenispasir.jpeg"],
                "description" => "Paket pemeriksaan ini dilakukan untuk mengetahui berbagai macam sifat pasir.",
                "laboratory_id" => $laboratories['LT'], // Lab Tanah
            ],
            [
                "name" => "Uji Kualitas Air Komprehensif",
                "price" => 800000,
                "images" => ["package_images/default.jpg"],
                "description" => "Paket pemeriksaan ini dilakukan untuk mengetahui kualitas air secara menyeluruh.",
                "laboratory_id" => $laboratories['LH'], // Lab Hidrologi
            ],
            [
                "name" => "Uji Kekuatan Beton dan Baja",
                "price" => 1200000,
                "images" => ["package_images/default.jpg"],
                "description" => "Paket pemeriksaan ini dilakukan untuk mengetahui kekuatan beton dan baja.",
                "laboratory_id" => $laboratories['LSBB'], // Lab Struktur dan Bahan Bangunan
            ],
            [
                "name" => "Pemetaan Geologi dan Hidrologi",
                "price" => 1500000,
                "images" => ["package_images/default.jpg"],
                "description" => "Paket pemeriksaan ini dilakukan untuk mengetahui kondisi geologi dan hidrologi suatu area.",
                "laboratory_id" => $laboratories['LP'], // Lab Pemetaan
            ],
            [
                "name" => "Uji Mekanika Tanah Lengkap",
                "price" => 1000000,
                "images" => ["package_images/default.jpg"],
                "description" => "Paket pemeriksaan ini dilakukan untuk mengetahui berbagai macam sifat mekanika tanah.",
                "laboratory_id" => $laboratories['LMT'], // Lab Mekanika Tanah
            ],
        ];

        foreach ($packages as $package) {
            Package::create($package);
        }
    }
}
