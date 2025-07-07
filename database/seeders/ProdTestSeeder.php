<?php

namespace Database\Seeders;

use App\Models\Test;
use App\Models\Category;
use App\Models\Laboratory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProdTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tests = [
            [
                "name" => "Uji Ekstraksi Aspal",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LT')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "Min 2 sampel",
                "price" => 250000,
                "daily_slot" => 20,
                "minimum_unit" => 2
            ],
            [
                "name" => "Uji Berat Jenis Core Drill Aspal",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LT')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "Min 3 sampel",
                "price" => 250000,
                "daily_slot" => 30,
                "minimum_unit" => 3
            ],
            [
                "name" => "Core Drill Aspal",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LT')->value('id'),
                "category_id" => Category::where('name', 'Titik')->value('id'),
                "description" => "Min 5 titik (belum termasuk biaya survey, transport & akomodasi)",
                "price" => 500000,
                "daily_slot" => 5,
                "minimum_unit" => 5
            ],
            [
                "name" => "Penetrasi Aspal",
                "images" => ["test_images/ujipenetrasiaspal.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LT')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "Min 2 sampel",
                "price" => 250000,
                "daily_slot" => 3,
                "minimum_unit" => 2
            ],
            [
                "name" => "Mix Design Laston",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LT')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "1 bulan 2 sampel",
                "price" => 2500000,
                "daily_slot" => 2,
                "minimum_unit" => 2
            ],
            [
                "name" => "Mix Design Latasir",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LT')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "1 bulan 2 sampel",
                "price" => 2500000,
                "daily_slot" => 2,
                "minimum_unit" => 2
            ],
            [
                "name" => "Mix Design LPA",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LT')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "1 bulan 2 sampel",
                "price" => 2500000,
                "daily_slot" => 2,
                "minimum_unit" => 2
            ],
            [
                "name" => "Uji Marshall",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LT')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "min 2 sampel",
                "price" => 250000,
                "daily_slot" => 3,
                "minimum_unit" => 2
            ],

            [
                "name" => "Pengukuran Debit Saluran",
                "images" => ["test_images/pengukurandebitaliran.jpeg"],
                "laboratory_id" => Laboratory::where('code', 'LH')->value('id'),
                "category_id" => Category::where('name', 'Titik')->value('id'),
                "description" => "Min 3 titik (belum termasuk transport & akomodasi)",
                "price" => 3000000,
                "daily_slot" => 3,
                "minimum_unit" => 3
            ],
            [
                "name" => "Pengukuran Bathimetri",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LH')->value('id'),
                "category_id" => Category::where('name', 'Ha')->value('id'),
                "description" => "Min 1 Ha (belum termasuk transport & akomodasi)",
                "price" => 3000000,
                "daily_slot" => 1,
                "minimum_unit" => 1
            ],
            [
                "name" => "Pengukuran Sedimen Layang",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LH')->value('id'),
                "category_id" => Category::where('name', 'Titik')->value('id'),
                "description" => "Min 3 titik (belum termasuk transport & akomodasi)",
                "price" => 3000000,
                "daily_slot" => 3,
                "minimum_unit" => 3
            ],
            [
                "name" => "Pengukuran Sedimen Dasar",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LH')->value('id'),
                "category_id" => Category::where('name', 'Titik')->value('id'),
                "description" => "Min 3 titik (belum termasuk transport & akomodasi)",
                "price" => 3000000,
                "daily_slot" => 3,
                "minimum_unit" => 3
            ],
            [
                "name" => "Uji Kualitas Air Pengecoran",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LH')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "1 (belum tersedia)",
                "price" => 300000,
                "daily_slot" => 1,
                "minimum_unit" => 1
            ],
            [
                "name" => "Uji Tekan Material (Alat Analog)",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LSBB')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "Minimal 2 sampel (belum termasuk biaya capping)",
                "price" => 400000,
                "daily_slot" => 50,
                "minimum_unit" => 2
            ],
            [
                "name" => "Uji Tarik Baja",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LSBB')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "Min 3 sampel (belum termasuk biaya bubut dan las)",
                "price" => 250000,
                "daily_slot" => 20,
                "minimum_unit" => 3
            ],
            [
                "name" => "Scan Rebar Beton",
                "images" => ["test_images/ujiscanrebar.jpeg"],
                "laboratory_id" => Laboratory::where('code', 'LSBB')->value('id'),
                "category_id" => Category::where('name', 'Titik')->value('id'),
                "description" => "Min 4 titik (belum termasuk transport & akomodasi)",
                "price" => 250000,
                "daily_slot" => 10,
                "minimum_unit" => 4
            ],
            [
                "name" => "Berat Jenis Kerikil",
                "images" => ["test_images/ujiberatjeniskerikil.jpeg"],
                "laboratory_id" => Laboratory::where('code', 'LSBB')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "2 satuan : 3 hari, paket kumplit : 7 hari",
                "price" => 100000,
                "daily_slot" => 2,
                "minimum_unit" => 2
            ],
            [
                "name" => "Berat Jenis Pasir",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LSBB')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "2 satuan : 3 hari, paket kumplit : 7 hari",
                "price" => 100000,
                "daily_slot" => 2,
                "minimum_unit" => 2
            ],
            [
                "name" => "Uji Gradasi Kerikil",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LSBB')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "2 satuan : 3 hari, paket kumplit : 7 hari",
                "price" => 200000,
                "daily_slot" => 2,
                "minimum_unit" => 2
            ],
            [
                "name" => "Uji Gradasi Pasir",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LSBB')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "2 satuan : 3 hari, paket kumplit : 7 hari",
                "price" => 200000,
                "daily_slot" => 2,
                "minimum_unit" => 2
            ],
            [
                "name" => "Uji Kandungan Lumpur Agregat",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LSBB')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "2 satuan : 3 hari, paket kumplit : 7 hari",
                "price" => 150000,
                "daily_slot" => 2,
                "minimum_unit" => 2
            ],
            [
                "name" => "Uji Abrasi",
                "images" => ["test_images/ujiabrasi.jpeg"],
                "laboratory_id" => Laboratory::where('code', 'LSBB')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "2 satuan : 3 hari, paket kumplit : 7 hari",
                "price" => 250000,
                "daily_slot" => 2,
                "minimum_unit" => 2
            ],
            [
                "name" => "Uji Absorbsi Beton",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LSBB')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "2",
                "price" => 150000,
                "daily_slot" => 2,
                "minimum_unit" => 2
            ],
            [
                "name" => "Uji Tarik Belah Beton",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LSBB')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "2",
                "price" => 200000,
                "daily_slot" => 2,
                "minimum_unit" => 2
            ],
            [
                "name" => "Uji Lentur Beton Polos",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LSBB')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "15",
                "price" => 300000,
                "daily_slot" => 15,
                "minimum_unit" => 15
            ],
            [
                "name" => "Uji Lentur Beton Bertulang, Kayu, Besi",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LSBB')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "20",
                "price" => 350000,
                "daily_slot" => 20,
                "minimum_unit" => 20
            ],
            [
                "name" => "Mix Design Beton",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LSBB')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "1",
                "price" => 2500000,
                "daily_slot" => 2,
                "minimum_unit" => 1
            ],
            [
                "name" => "Uji Tekan Material (Alat Digital)",
                "images" => ["test_images/ujitekandigital.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LSBB')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "50",
                "price" => 450000,
                "daily_slot" => 50,
                "minimum_unit" => 50
            ],
            [
                "name" => "Berat Volume Material",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LSBB')->value('id'),
                "category_id" => Category::where('name', 'Sampel')->value('id'),
                "description" => "2 satuan : 3 hari, paket kumplit : 7 hari",
                "price" => 200000,
                "daily_slot" => 2,
                "minimum_unit" => 2
            ],
            [
                "name" => "Core Drill Beton",
                "images" => ["test_images/default.jpg"],
                "laboratory_id" => Laboratory::where('code', 'LSBB')->value('id'),
                "category_id" => Category::where('name', 'Titik')->value('id'),
                "description" => "Min 5 titik (belum termasuk transport & akomodasi)",
                "price" => 700000,
                "daily_slot" => 5,
                "minimum_unit" => 5
            ],
        ];


        foreach ($tests as $test) {
            Test::create($test);
        }
    }
}
