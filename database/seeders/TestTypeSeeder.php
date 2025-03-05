<?php

namespace Database\Seeders;

use App\Models\TestType;
use App\Models\UnitCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TestTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        UnitCategory::create([
            "name" => "sample",
            "description" => ""
        ]);
        UnitCategory::create([
            "name" => "titik",
            "description" => ""
        ]);

        TestType::create([
            "name" => "uji ekstraksi aspal",
            "price" => 250000,
            "minimum_unit" => 2,
            "laboratory_id" => 1,
            "unit_category_id" => 1
        ]);
        TestType::create([
            "name" => "uji berat core drill aspal",
            "price" => 100000,
            "minimum_unit" => 3,
            "laboratory_id" => 1,
            "unit_category_id" => 1
        ]);
        TestType::create([
            "name" => "core drill aspal",
            "price" => 200000,
            "minimum_unit" => 3,
            "laboratory_id" => 1,
            "unit_category_id" => 1
        ]);
    }
}
