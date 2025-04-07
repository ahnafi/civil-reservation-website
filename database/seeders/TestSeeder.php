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
            // Tests for Lab Tanah (laboratory_id = 1)
            [
                "name" => "Uji Kadar Air Tanah",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kadar air dalam tanah.",
                "price" => 250000,
                "minimum_unit" => 1,
                "daily_slot" => 10,
                "laboratory_id" => 1,
                "category_id" => 1
            ],
            [
                "name" => "Uji Konsistensi Tanah",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui konsistensi tanah.",
                "price" => 300000,
                "minimum_unit" => 1,
                "daily_slot" => 8,
                "laboratory_id" => 1,
                "category_id" => 1
            ],
            // Additional tests for Lab Tanah
            [
                "name" => "Uji Kekuatan Geser Tanah",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kekuatan geser tanah.",
                "price" => 350000,
                "minimum_unit" => 2,
                "daily_slot" => 5,
                "laboratory_id" => 1,
                "category_id" => 1
            ],
            [
                "name" => "Uji Tekan Tanah",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kekuatan tekan tanah.",
                "price" => 450000,
                "minimum_unit" => 2,
                "daily_slot" => 4,
                "laboratory_id" => 1,
                "category_id" => 1
            ],
            // Tests for Lab Hidrologi (laboratory_id = 2)
            [
                "name" => "Uji Kualitas Air",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kualitas air.",
                "price" => 400000,
                "minimum_unit" => 2,
                "daily_slot" => 5,
                "laboratory_id" => 2,
                "category_id" => 2
            ],
            [
                "name" => "Uji pH Air",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui tingkat keasaman air.",
                "price" => 150000,
                "minimum_unit" => 1,
                "daily_slot" => 10,
                "laboratory_id" => 2,
                "category_id" => 2
            ],
            // Additional tests for Lab Hidrologi
            [
                "name" => "Uji Kandungan Lumpur",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kandungan lumpur dalam air.",
                "price" => 200000,
                "minimum_unit" => 1,
                "daily_slot" => 5,
                "laboratory_id" => 2,
                "category_id" => 2
            ],
            [
                "name" => "Uji Kekeruhan Air",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui tingkat kekeruhan air.",
                "price" => 250000,
                "minimum_unit" => 1,
                "daily_slot" => 5,
                "laboratory_id" => 2,
                "category_id" => 2
            ],
            // Tests for Lab Struktur dan Bahan Bangunan (laboratory_id = 3)
            [
                "name" => "Uji Kekuatan Beton",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kekuatan beton.",
                "price" => 500000,
                "minimum_unit" => 3,
                "daily_slot" => 7,
                "laboratory_id" => 3,
                "category_id" => 1
            ],
            [
                "name" => "Uji Kualitas Baja",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kualitas baja.",
                "price" => 600000,
                "minimum_unit" => 2,
                "daily_slot" => 6,
                "laboratory_id" => 3,
                "category_id" => 1
            ],
            // Additional tests for Lab Struktur dan Bahan Bangunan
            [
                "name" => "Uji Kekuatan Tarik Baja",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kekuatan tarik baja.",
                "price" => 700000,
                "minimum_unit" => 2,
                "daily_slot" => 5,
                "laboratory_id" => 3,
                "category_id" => 1
            ],
            [
                "name" => "Uji Kekuatan Lentur Beton",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kekuatan lentur beton.",
                "price" => 800000,
                "minimum_unit" => 2,
                "daily_slot" => 4,
                "laboratory_id" => 3,
                "category_id" => 1
            ],
            // Tests for Lab Pemetaan (laboratory_id = 4)
            [
                "name" => "Pemetaan Topografi",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui topografi suatu area.",
                "price" => 700000,
                "minimum_unit" => 1,
                "daily_slot" => 4,
                "laboratory_id" => 4,
                "category_id" => 3
            ],
            [
                "name" => "Pemetaan Geologi",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kondisi geologi suatu area.",
                "price" => 800000,
                "minimum_unit" => 1,
                "daily_slot" => 3,
                "laboratory_id" => 4,
                "category_id" => 3
            ],
            // Additional tests for Lab Pemetaan
            [
                "name" => "Pemetaan Hidrologi",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kondisi hidrologi suatu area.",
                "price" => 900000,
                "minimum_unit" => 1,
                "daily_slot" => 2,
                "laboratory_id" => 4,
                "category_id" => 3
            ],
            [
                "name" => "Pemetaan Vegetasi",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kondisi vegetasi suatu area.",
                "price" => 1000000,
                "minimum_unit" => 1,
                "daily_slot" => 1,
                "laboratory_id" => 4,
                "category_id" => 3
            ],
            // Tests for Lab Mekanika Tanah (laboratory_id = 5)
            [
                "name" => "Uji Geser Tanah",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kekuatan geser tanah.",
                "price" => 350000,
                "minimum_unit" => 2,
                "daily_slot" => 5,
                "laboratory_id" => 5,
                "category_id" => 1
            ],
            [
                "name" => "Uji Tekan Tanah",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kekuatan tekan tanah.",
                "price" => 450000,
                "minimum_unit" => 2,
                "daily_slot" => 4,
                "laboratory_id" => 5,
                "category_id" => 1
            ],
            // Additional tests for Lab Mekanika Tanah
            [
                "name" => "Uji Konsolidasi Tanah",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui konsolidasi tanah.",
                "price" => 500000,
                "minimum_unit" => 2,
                "daily_slot" => 3,
                "laboratory_id" => 5,
                "category_id" => 1
            ],
            [
                "name" => "Uji Permeabilitas Tanah",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui permeabilitas tanah.",
                "price" => 550000,
                "minimum_unit" => 2,
                "daily_slot" => 2,
                "laboratory_id" => 5,
                "category_id" => 1
            ]
        ];

        foreach ($tests as $test) {
            Test::create($test);
        }
    }
}
