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
                "description" => "Laboratorium yang digunakan untuk melakukan pengujian dan analisis terhadap tanah, termasuk sifat fisik, kimia, dan mekanik tanah.",
                "images" => ["laboratory_images/lt.jpg"],
            ],
            [
                "code" => "LH",
                "name" => "Lab Hidrologi",
                "room" => "D 102",
                "description" => "Laboratorium yang digunakan untuk melakukan pengujian dan analisis terhadap air, termasuk kualitas air, aliran sungai, dan siklus hidrologi.",
                "images" => ["laboratory_images/lh.jpg"],
            ],
            [
                "code" => "LSBB",
                "name" => "Lab Struktur dan Bahan Bangunan",
                "room" => "D 103",
                "description" => "Laboratorium Struktur dan Laboratorium yang digunakan untuk melakukan pengujian dan analisis terhadap bahan bangunan, termasuk beton, baja, dan material lainnya.",
                "images" => ["laboratory_images/lsbb.jpg"],
            ],
            [
                "code" => "LP",
                "name" => "Lab Pemetaan",
                "room" => "D 104",
                "description" => "Laboratorium yang digunakan untuk melakukan pengujian dan analisis terhadap data pemetaan, termasuk survei tanah, pemetaan topografi, dan pemetaan geospasial.",
                "images" => ["laboratory_images/lp.jpg"],
            ],
            [
                "code" => "LMT",
                "name" => "Lab Mekanika Tanah",
                "room" => "D 105",
                "description" => "Laboratorium Laboratorium yang digunakan untuk melakukan pengujian dan analisis terhadap sifat mekanik tanah, termasuk kekuatan, kepadatan, dan permeabilitas tanah.",
                "images" => ["laboratory_images/lmt.jpg"],
            ]
        ];

        foreach ($laboratories as $laboratory) {
            Laboratory::create($laboratory);
        }
    }
}
