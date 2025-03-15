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
            [
                "package_id" => 1,
                "test_id" => 2
            ],
            [
                "package_id" => 1,
                "test_id" => 3
            ],
            [
                "package_id" => 1,
                "test_id" => 4
            ],
            [
                "package_id" => 1,
                "test_id" => 5
            ]
        ];

        foreach ($packageTests as $packageTest) {

        }
    }
}
