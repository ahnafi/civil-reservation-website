<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Test;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tests = [
            [
                "name" => "Uji Ekstraksi Aspal",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kadar aspal dalam campuran aspal.",
                "price" => 300000,
                "minimum_unit" => 2,
                "daily_slot" => 20,
                "laboratory_id" => 1,
                "category_id" => 1
            ],
            [
                "name" => "Uji Berat Jenis Pasir",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui berat jenis pasir.",
                "price" => 100000,
                "minimum_unit" => 1,
                "daily_slot" => 10,
                "laboratory_id" => 3,
                "category_id" => 1
            ],
            [
                "name" => "Uji Gradasi Pasir",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui gradasi pasir.",
                "price" => 200000,
                "minimum_unit" => 1,
                "daily_slot" => 5,
                "laboratory_id" => 3,
                "category_id" => 1
            ],
            [
                "name" => "Uji Kandungan Lumpur Agregat",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kandungan lumpur dalam air.",
                "price" => 150000,
                "minimum_unit" => 1,
                "daily_slot" => 5,
                "laboratory_id" => 3,
                "category_id" => 1
            ],
            [
                "name" => "Uji Berat Volume",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui berat volume.",
                "price" => 150000,
                "minimum_unit" => 1,
                "daily_slot" => 5,
                "laboratory_id" => 3,
                "category_id" => 1
            ],
            [
                "name" => "Pengukuran Debit Saluran",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui debit air yang mengalir dalam saluran tertentu.",
                "price" => 500000,
                "minimum_unit" => 3,
                "daily_slot" => 3,
                "laboratory_id" => 2,
                "category_id" => 2
            ],
            [
                "name" => "Uji Tekan Material",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kekuatan material tertentu.",
                "price" => 250000,
                "minimum_unit" => 2,
                "daily_slot" => 50,
                "laboratory_id" => 3,
                "category_id" => 1
            ],
            [
                "name" => "Uji Sondir",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kekuatan tanah.",
                "price" => 400000,
                "minimum_unit" => 2,
                "daily_slot" => 2,
                "laboratory_id" => 4,
                "category_id" => 1
            ],
            [
                "name" => "Pemetaan Kontur Tanah",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kontur tanah.",
                "price" => 150000,
                "minimum_unit" => 1,
                "daily_slot" => 1,
                "laboratory_id" => 5,
                "category_id" => 3
            ],
            [
                "name" => "Pemetaan Saluran Drainase",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui saluran drainase.",
                "price" => 200000,
                "minimum_unit" => 1000,
                "daily_slot" => 1,
                "laboratory_id" => 5,
                "category_id" => 4
            ]
        ];

        foreach ($tests as $test) {
            Test::create($test);
        }
    }
}
