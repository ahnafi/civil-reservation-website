<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TestProdSeeder extends Seeder
{
    /**
     * Copas ke notes sebelum ngetik data seeder
     *
     * Laboratory:
     * 1. Lab Tanah
     * 2. Lab Hidrologi
     * 3. Lab Struktur dan Bahan Bangunan
     * 4. Lab Mekanika Tanah
     * 5. Lab Pemetaan
     *
     * Category:
     * 1. Sampel
     * 2. Titik
     * 3. Ha
     * 4. Meter
     * 5. m
     */
    public function run(): void
    {
        $tests = [
            // Tests for Lab Tanah (laboratory_id = 1)
            [
                "name" => "Uji Ekstraksi Aspal",
                "description" => "Uji ini dilakukan untuk mengetahui kadar aspal dalam campuran aspal. Minimum reservasi adalah 2 sampel. Estimasi maksimal penyelesaian laporan adalah 4 hari kerja.",
                "images" => ["test_images/UEA.jpeg"],
                "price" => 250000,
                "minimum_unit" => 2,
                "daily_slot" => 20,
                "laboratory_id" => 1,
                "category_id" => 1
            ],
            [
                "name" => "Uji Berat Jenis Core Drill Aspal",
                "description" => "Uji ini dilakukan untuk mengetahui berat jenis dari core drill aspal. Minimum reservasi adalah 3 sampel. Estimasi maksimal penyelesaian laporan adalah 4 hari kerja.",
                "images" => ["test_images/UBJCDA.jpeg"],
                "price" => 100000,
                "minimum_unit" => 3,
                "daily_slot" => 30,
                "laboratory_id" => 1,
                "category_id" => 1
            ],
            [
                "name" => "Core Drill Aspal",
                "description" => "Core drill aspal adalah metode pengambilan sampel aspal dari permukaan jalan untuk analisis lebih lanjut. Minimum reservasi adalah 5 titik. Estimasi maksimal penyelesaian laporan adalah 14 hari kerja. (Biaya utama belum termasuk biaya survei, transportasi, dan akomodasi)",
                "images" => ["test_images/CDA.jpeg"],
                "price" => 200000,
                "minimum_unit" => 5,
                "daily_slot" => 5,
                "laboratory_id" => 1,
                "category_id" => 2
            ],
            [
                "name" => "Penetrasi Aspal",
                "description" => "Uji penetrasi aspal dilakukan untuk mengukur kekerasan atau kelembutan aspal dengan cara menekan jarum standar ke dalam sampel aspal pada kondisi tertentu. Minimum reservasi adalah 2 sampel. Estimasi maksimal penyelesaian laporan adalah 7 hari kerja.",
                "images" => ["test_images/PA.jpg"],
                "price" => 250000,
                "minimum_unit" => 2,
                "daily_slot" => 3,
                "laboratory_id" => 1,
                "category_id" => 1
            ],
            [
                "name" => "Mix Design Laston",
                "description" => "Mix Design Laston adalah proses perancangan campuran aspal yang optimal untuk digunakan dalam konstruksi jalan, dengan mempertimbangkan berbagai faktor seperti jenis bahan, proporsi campuran, dan kondisi lingkungan. Dalam 1 bulan hanya menerima 2 sampel. Estimasi maksimal penyelesaian laporan adalah 14 hari kerja.",
                "images" => ["test_images/MDLAS.jpeg"],
                "price" => 4500000,
                "minimum_unit" => 1,
                "daily_slot" => 1,
                "laboratory_id" => 1,
                "category_id" => 1
            ],
            [
                "name" => "Mix Design Latasir",
                "description" => "Mix Design Latasir adalah proses perancangan campuran aspal yang optimal untuk digunakan dalam konstruksi jalan, dengan mempertimbangkan berbagai faktor seperti jenis bahan, proporsi campuran, dan kondisi lingkungan. Dalam 1 bulan hanya menerima 2 sampel. Estimasi maksimal penyelesaian laporan adalah 14 hari kerja.",
                "images" => ["test_images/MDLAT.jpeg"],
                "price" => 2500000,
                "minimum_unit" => 1,
                "daily_slot" => 1,
                "laboratory_id" => 1,
                "category_id" => 1
            ],
            [
                "name" => "Mix Design LPA",
                "description" => "Mix Design LPA adalah proses perancangan campuran aspal yang optimal untuk digunakan dalam konstruksi jalan, dengan mempertimbangkan berbagai faktor seperti jenis bahan, proporsi campuran, dan kondisi lingkungan. Dalam 1 bulan hanya menerima 2 sampel. Estimasi maksimal penyelesaian laporan adalah 14 hari kerja.",
                "images" => ["test_images/MLPA.jpeg"],
                "price" => 3500000,
                "minimum_unit" => 1,
                "daily_slot" => 1,
                "laboratory_id" => 1,
                "category_id" => 1
            ],
            [
                "name" => "Uji Marshall",
                "description" => "Uji Marshall adalah metode pengujian laboratorium yang digunakan untuk menentukan stabilitas dan kepadatan campuran aspal, serta untuk merancang campuran aspal yang sesuai dengan spesifikasi teknis. Minimum reservasi adalah 2 sampel. Estimasi maksimal penyelesaian laporan adalah 7 hari kerja.",
                "images" => ["test_images/UM.jpeg"],
                "price" => 250000,
                "minimum_unit" => 2,
                "daily_slot" => 3,
                "laboratory_id" => 1,
                "category_id" => 1
            ],
            // Tests for Lab Hidrologi (laboratory_id = 2)
            [
                "name" => "Pengukuran Debit Saluran",
                "description" => "Uji ini dilakukan untuk mengukur debit aliran air dalam saluran terbuka atau tertutup. Minimum reservasi adalah 3 titik. Estimasi maksimal penyelesaian laporan adalah 14 hari kerja. (Biaya utama belum termasuk biaya transportasi, dan akomodasi)",
                "images" => ["test_images/PDS.jpeg"],
                "price" => 300000,
                "minimum_unit" => 3,
                "daily_slot" => 3,
                "laboratory_id" => 2,
                "category_id" => 2
            ],
            [
                "name" => "Pengukuran Bathimetri",
                "description" => "Uji ini dilakukan untuk mengukur kedalaman dan kontur dasar perairan seperti sungai, danau, atau laut. Minimum reservasi adalah 1 Ha. Estimasi maksimal penyelesaian laporan adalah 14 hari kerja. (Biaya utama belum termasuk biaya transportasi, dan akomodasi)",
                "images" => ["test_images/LH.jpeg"],
                "price" => 1500000,
                "minimum_unit" => 1,
                "daily_slot" => 1,
                "laboratory_id" => 2,
                "category_id" => 3
            ]
        ];
    }
}
