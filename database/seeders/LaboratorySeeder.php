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
        $laboratories=[
            [
                "code" => "LT",
                "name" => "Lab Tanah",
                "room" => "D 101",

            ],
            [
                "code" => "LH",
                "name" => "Lab Hidrologi",
                "room" => "D 102",

            ],
            [
                "code" => "LSBB",
                "name" => "Lab Struktur dan Bahan Bangunan",
                "room" => "D 103",

            ],
            [
                "code" => "LP",
                "name" => "Lab Pemetaan",
                "room" => "D 104",

            ],
            [
                "code" => "LMT",
                "name" => "Lab Mekanika Tanah",
                "room" => "D 105",

            ]
        ];

        foreach ($laboratories as $laboratory) {
            Laboratory::create($laboratory);
        }
    }
}
