<?php

namespace Database\Seeders;

use App\Models\Laboratory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LaboratorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Laboratory::create([
            "name" => "LT",
            "room" => "D 101",
            "daily_slots" => 5,
        ]);
        Laboratory::create([
            "name" => "LH",
            "room" => "D 102",
            "daily_slots" => 5,
        ]);
        Laboratory::create([
            "name" => "LSBB",
            "room" => "D 103",
            "daily_slots" => 5,
        ]);
    }
}
