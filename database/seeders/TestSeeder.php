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
                "images" => ["default.jpg"],
                "price" => 250000,
                "minimum_unit" => 1,
                "daily_slot" => 10,
                "laboratory_id" => 1,
                "category_id" => 1
            ],
            [
                "name" => "Uji Konsistensi Tanah",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui konsistensi tanah.",
                "images" => ["default.jpg"],
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
                "images" => ["default.jpg"],
                "price" => 350000,
                "minimum_unit" => 2,
                "daily_slot" => 5,
                "laboratory_id" => 1,
                "category_id" => 1
            ],
            [
                "name" => "Uji Tekan Tanah",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kekuatan tekan tanah.",
                "images" => ["default.jpg"],
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
                "images" => ["default.jpg"],
                "price" => 400000,
                "minimum_unit" => 2,
                "daily_slot" => 5,
                "laboratory_id" => 2,
                "category_id" => 2
            ],
            [
                "name" => "Uji pH Air",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui tingkat keasaman air.",
                "images" => ["default.jpg"],
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
                "images" => ["default.jpg"],
                "price" => 200000,
                "minimum_unit" => 1,
                "daily_slot" => 5,
                "laboratory_id" => 2,
                "category_id" => 2
            ],
            [
                "name" => "Uji Kekeruhan Air",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui tingkat kekeruhan air.",
                "images" => ["default.jpg"],
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
                "images" => ["default.jpg"],
                "price" => 500000,
                "minimum_unit" => 3,
                "daily_slot" => 7,
                "laboratory_id" => 3,
                "category_id" => 1
            ],
            [
                "name" => "Uji Kualitas Baja",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kualitas baja.",
                "images" => ["default.jpg"],
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
                "images" => ["default.jpg"],
                "price" => 700000,
                "minimum_unit" => 2,
                "daily_slot" => 5,
                "laboratory_id" => 3,
                "category_id" => 1
            ],
            [
                "name" => "Uji Kekuatan Lentur Beton",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kekuatan lentur beton.",
                "images" => ["default.jpg"],
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
                "images" => ["default.jpg"],
                "price" => 700000,
                "minimum_unit" => 1,
                "daily_slot" => 4,
                "laboratory_id" => 4,
                "category_id" => 3
            ],
            [
                "name" => "Pemetaan Geologi",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kondisi geologi suatu area.",
                "images" => ["default.jpg"],
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
                "images" => ["default.jpg"],
                "price" => 900000,
                "minimum_unit" => 1,
                "daily_slot" => 2,
                "laboratory_id" => 4,
                "category_id" => 3
            ],
            [
                "name" => "Pemetaan Vegetasi",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kondisi vegetasi suatu area.",
                "images" => ["default.jpg"],
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
                "images" => ["default.jpg"],
                "price" => 350000,
                "minimum_unit" => 2,
                "daily_slot" => 5,
                "laboratory_id" => 5,
                "category_id" => 1
            ],
            [
                "name" => "Uji Tekan Tanah",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kekuatan tekan tanah.",
                "images" => ["default.jpg"],
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
                "images" => ["default.jpg"],
                "price" => 500000,
                "minimum_unit" => 2,
                "daily_slot" => 3,
                "laboratory_id" => 5,
                "category_id" => 1
            ],
            [
                "name" => "Uji Permeabilitas Tanah",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui permeabilitas tanah.",
                "images" => ["default.jpg"],
                "price" => 550000,
                "minimum_unit" => 2,
                "daily_slot" => 2,
                "laboratory_id" => 5,
                "category_id" => 1
            ],

            // Additional with images
            [
                "name" => "Pengukuran Debit Saluran",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui debit aliran dalam saluran.",
                "price" => 300000,
                "images" => ["pengukurandebitaliran.jpeg"],
                "minimum_unit" => 3,
                "daily_slot" => 3,
                "laboratory_id" => 2,
                "category_id" => 2
            ],
            [
               "name" => "Uji Abrasi",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui ketahanan material terhadap abrasi.",
                "price" => 250000,
                "images" => ['ujiabrasi.jpeg'],
                "daily_slot" => 2,
                "laboratory_id" => 3,
                "category_id" => 1
            ],
            [
                "name" => "Uji Berat Jenis Besi",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui berat jenis besi.",
                "price" => 200000,
                "images" => ["ujiberatjenisbesi.jpeg"],
                "daily_slot" => 2,
                "laboratory_id" => 3,
                "category_id" => 1
            ],
            [
                "name" => "Uji Berat Jenis Kerikil",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui berat jenis pasir.",
                "price" => 100000,
                "images" => ["ujiberatjeniskerikil.jpeg"],
                "daily_slot" => 2,
                "laboratory_id" => 3,
                "category_id" => 1
            ],
            [
                "name" => "Uji Geser Langsung Tanah",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kekuatan geser tanah.",
                "price" => 200000,
                "images" => ["ujigeserlangsungtanah.jpeg"],
                "daily_slot" => 2,
                "laboratory_id" => 5,
                "category_id" => 1
            ],
            [
                "name" => "Uji Penetrasi Aspal",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui tingkat penetrasi aspal.",
                "price" => 250000,
                "images" => ["ujipenetrasiaspal.jpg"],
                "daily_slot" => 2,
                "laboratory_id" => 1,
                "category_id" => 1
            ],
            [
                "name" => "Uji Scan Rebar",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui posisi dan diameter rebar dalam beton.",
                "price" => 250000,
                "images" => ["ujiscanrebar.jpeg"],
                "minimum_unit" => 4,
                "daily_slot" => 1,
                "laboratory_id" => 3,
                "category_id" => 2
            ],
            [
                "name" => "Uji Tekan Digital",
                "description" => "Pemeriksaan ini dilakukan untuk mengetahui kekuatan tekan material secara digital.",
                "images" => ["ujitekandigital.jpg"],
                "price" => 150000,
                "laboratory_id" => 3,
                "category_id" => 1
            ]

        ];

        foreach ($tests as $test) {
            Test::create($test);
        }
    }
}
