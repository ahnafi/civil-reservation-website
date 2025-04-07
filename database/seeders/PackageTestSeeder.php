<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PackageTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packageTests = [
            // Package 1: Uji Material Pasir Lengkap
            ["package_id" => 1, "test_id" => 1],
            ["package_id" => 1, "test_id" => 2],
            // Package 2: Uji Kualitas Air Komprehensif
            ["package_id" => 2, "test_id" => 3],
            ["package_id" => 2, "test_id" => 4],
            // Package 3: Uji Kekuatan Beton dan Baja
            ["package_id" => 3, "test_id" => 5],
            ["package_id" => 3, "test_id" => 6],
            // Package 4: Pemetaan Geologi dan Hidrologi
            ["package_id" => 4, "test_id" => 7],
            ["package_id" => 4, "test_id" => 8],
            // Package 5: Uji Mekanika Tanah Lengkap
            ["package_id" => 5, "test_id" => 9],
            ["package_id" => 5, "test_id" => 10]
        ];

        foreach ($packageTests as $packageTest) {
            DB::table('package_test')->insert($packageTest);
        }
    }
}
