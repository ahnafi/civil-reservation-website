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
            ],
            // 11 - 25
            [
                "name" => "Pengukuran Sedimen Layang",
                "description" => "Pengujian ini dilakukan untuk mengukur sedimen layang. Minimum reservasi adalah 3 titik (belum termasuk transport & akomodasi). Estimasi maksimal penyelesaian laporan adalah 14 hari kerja.",
                "images" => ["test_images/LH.jpeg"],
                "price" => 300000, // Harga tidak tersedia dalam dokumen
                "minimum_unit" => 3,
                "daily_slot" => 3,
                "laboratory_id" => 2, // Lab Hidrologi
                "category_id" => 2   // Titik
            ],
            [
                "name" => "Pengukuran Sedimen Dasar",
                "description" => "Pengujian ini dilakukan untuk mengukur sedimen dasar. Minimum reservasi adalah 3 titik (belum termasuk transport & akomodasi). Estimasi maksimal penyelesaian laporan adalah 14 hari kerja.",
                "images" => ["test_images/LH.jpeg"],
                "price" => 300000, // Harga tidak tersedia dalam dokumen
                "minimum_unit" => 3,
                "daily_slot" => 3,
                "laboratory_id" => 2, // Lab Hidrologi
                "category_id" => 2   // Titik
            ],
            [
                "name" => "Uji Kualitas Air Pengecoran",
                "description" => "Pengujian ini dilakukan untuk memeriksa kualitas air yang akan digunakan untuk pengecoran. Kuota harian saat ini belum tersedia. Estimasi maksimal penyelesaian laporan adalah 14 hari kerja.",
                "images" => ["test_images/LH.jpeg"],
                "price" => 200000, // Harga tidak tersedia dalam dokumen
                "minimum_unit" => 1, // Tidak ada minimum, diasumsikan 1
                "daily_slot" => 1, // Belum tersedia
                "laboratory_id" => 2, // Lab Hidrologi
                "category_id" => 1   // Sampel
            ],
            [
                "name" => "Uji Tekan Material (Alat Analog)",
                "description" => "Pengujian ini bertujuan untuk mengetahui kuat tekan material menggunakan alat analog. Minimum reservasi adalah 2 sampel (belum termasuk biaya capping). Estimasi maksimal penyelesaian laporan adalah 3 hari kerja.",
                "images" => ["test_images/UTM_Analog.jpeg"],
                "price" => 40000, // Harga tidak tersedia dalam dokumen
                "minimum_unit" => 2,
                "daily_slot" => 50,
                "laboratory_id" => 3, // Lab Struktur dan Bahan Bangunan
                "category_id" => 1   // Sampel
            ],
            [
                "name" => "Uji Tarik Baja",
                "description" => "Pengujian ini dilakukan untuk mengetahui kekuatan tarik baja. Minimum reservasi adalah 3 sampel (belum termasuk biaya bubut dan las). Estimasi maksimal penyelesaian laporan adalah 3 hari kerja.",
                "images" => ["test_images/UTB.jpeg"],
                "price" => 175000, // Harga tidak tersedia dalam dokumen
                "minimum_unit" => 3,
                "daily_slot" => 20,
                "laboratory_id" => 3, // Lab Struktur dan Bahan Bangunan
                "category_id" => 1   // Sampel
            ],
            [
                "name" => "Scan Rebar Beton",
                "description" => "Layanan ini untuk melakukan pemindaian tulangan (rebar) di dalam beton. Minimum reservasi adalah 4 titik (belum termasuk transport & akomodasi). Kuota harian hanya untuk 1 pelanggan. Estimasi maksimal penyelesaian laporan adalah 14 hari kerja.",
                "images" => ["test_images/SRB.jpeg"],
                "price" => 250000, // Harga tidak tersedia dalam dokumen
                "minimum_unit" => 4,
                "daily_slot" => 10,
                "laboratory_id" => 3, // Lab Struktur dan Bahan Bangunan
                "category_id" => 2   // Titik
            ],
            [
                "name" => "Berat Jenis Kerikil",
                "description" => "Pengujian ini untuk menentukan berat jenis dari agregat kasar (kerikil). Estimasi penyelesaian untuk satuan adalah 3 hari, dan untuk paket kumplit adalah 7 hari.",
                "images" => ["test_images/BJK.jpeg"],
                "price" => 100000, // Harga tidak tersedia dalam dokumen
                "minimum_unit" => 1, // Tidak ada minimum, diasumsikan 1
                "daily_slot" => 2,
                "laboratory_id" => 3, // Lab Struktur dan Bahan Bangunan
                "category_id" => 1   // Sampel
            ],
            [
                "name" => "Berat Jenis Pasir",
                "description" => "Pengujian ini untuk menentukan berat jenis dari agregat halus (pasir). Estimasi penyelesaian untuk satuan adalah 3 hari, dan untuk paket kumplit adalah 7 hari.",
                "images" => ["test_images/BJP.jpeg"],
                "price" => 100000, // Harga tidak tersedia dalam dokumen
                "minimum_unit" => 1, // Tidak ada minimum, diasumsikan 1
                "daily_slot" => 2,
                "laboratory_id" => 3, // Lab Struktur dan Bahan Bangunan
                "category_id" => 1   // Sampel
            ],
            [
                "name" => "Uji Gradasi Kerikil",
                "description" => "Pengujian ini bertujuan untuk mengetahui distribusi ukuran butiran kerikil. Estimasi penyelesaian untuk satuan adalah 3 hari, dan untuk paket kumplit adalah 7 hari.",
                "images" => ["test_images/UGK.jpeg"],
                "price" => 200000, // Harga tidak tersedia dalam dokumen
                "minimum_unit" => 1, // Tidak ada minimum, diasumsikan 1
                "daily_slot" => 2,
                "laboratory_id" => 3, // Lab Struktur dan Bahan Bangunan
                "category_id" => 1   // Sampel
            ],
            [
                "name" => "Uji Gradasi Pasir",
                "description" => "Pengujian ini bertujuan untuk mengetahui distribusi ukuran butiran pasir. Estimasi penyelesaian untuk satuan adalah 3 hari, dan untuk paket kumplit adalah 7 hari.",
                "images" => ["test_images/UGP.jpeg"],
                "price" => 200000, // Harga tidak tersedia dalam dokumen
                "minimum_unit" => 1, // Tidak ada minimum, diasumsikan 1
                "daily_slot" => 2,
                "laboratory_id" => 3, // Lab Struktur dan Bahan Bangunan
                "category_id" => 1   // Sampel
            ],
            [
                "name" => "Uji Kandungan Lumpur Agregat",
                "description" => "Pengujian ini untuk menentukan persentase kandungan lumpur dalam agregat. Estimasi penyelesaian untuk satuan adalah 3 hari, dan untuk paket kumplit adalah 7 hari.",
                "images" => ["test_images/LSBB.jpeg"],
                "price" => 150000, // Harga tidak tersedia dalam dokumen
                "minimum_unit" => 1, // Tidak ada minimum, diasumsikan 1
                "daily_slot" => 2,
                "laboratory_id" => 3, // Lab Struktur dan Bahan Bangunan
                "category_id" => 1   // Sampel
            ],
            [
                "name" => "Uji Abrasi",
                "description" => "Pengujian ini dilakukan untuk mengukur ketahanan aus (abrasi) pada agregat. Estimasi penyelesaian untuk satuan adalah 3 hari, dan untuk paket kumplit adalah 7 hari.",
                "images" => ["test_images/UA.jpeg"],
                "price" => 250000, // Harga tidak tersedia dalam dokumen
                "minimum_unit" => 1, // Tidak ada minimum, diasumsikan 1
                "daily_slot" => 2,
                "laboratory_id" => 3, // Lab Struktur dan Bahan Bangunan
                "category_id" => 1   // Sampel
            ],
            [
                "name" => "Uji Absorbsi Beton",
                "description" => "Pengujian ini untuk mengukur kemampuan beton dalam menyerap air (absorbsi). Estimasi maksimal penyelesaian laporan adalah 3 hari kerja.",
                "images" => ["test_images/LSBB.jpeg"],
                "price" => 200000, // Harga tidak tersedia dalam dokumen
                "minimum_unit" => 1, // Tidak ada minimum, diasumsikan 1
                "daily_slot" => 2,
                "laboratory_id" => 3, // Lab Struktur dan Bahan Bangunan
                "category_id" => 1   // Sampel
            ],
            [
                "name" => "Uji Tarik Belah Beton",
                "description" => "Pengujian ini bertujuan untuk mengetahui kekuatan tarik belah dari sampel beton. Estimasi maksimal penyelesaian laporan adalah 3 hari kerja.",
                "images" => ["test_images/LSBB.jpeg"],
                "price" => 200000, // Harga tidak tersedia dalam dokumen
                "minimum_unit" => 1, // Tidak ada minimum, diasumsikan 1
                "daily_slot" => 2,
                "laboratory_id" => 3, // Lab Struktur dan Bahan Bangunan
                "category_id" => 1   // Sampel
            ],
            [
                "name" => "Uji Lentur Beton Polos",
                "description" => "Pengujian ini dilakukan untuk mengukur kekuatan lentur dari beton polos. Estimasi maksimal penyelesaian laporan adalah 3 hari kerja.",
                "images" => ["test_images/ULBP.jpeg"],
                "price" => 200000, // Harga tidak tersedia dalam dokumen
                "minimum_unit" => 1, // Tidak ada minimum, diasumsikan 1
                "daily_slot" => 15,
                "laboratory_id" => 3, // Lab Struktur dan Bahan Bangunan
                "category_id" => 1   // Sampel
            ],
            // 26-40
            [
                "name" => "Uji Lentur Beton Bertulang, Kayu, Besi, Lainnya",
                "description" => "Uji Lentur Beton Bertulang, Kayu, Besi, Lainnya adalah metode pengujian yang digunakan untuk menentukan kekuatan lentur material tersebut dengan cara memberikan beban pada spesimen hingga terjadi kegagalan. Minimum reservasi adalah 1 sampel. Estimasi maksimal penyelesaian laporan adalah 3 hari kerja.",
                "images" => ["test_images/ULBBKL.jpeg"],
                "price" => 250000,
                "minimum_unit" => 1,
                "daily_slot" => 20,
                "laboratory_id" => 3,
                "category_id" => 1
            ],
            [
                "name" => "Mix Design Beton",
                "description" => "Mix Design Beton adalah proses perancangan campuran beton yang optimal untuk digunakan dalam konstruksi, dengan mempertimbangkan berbagai faktor seperti jenis bahan, proporsi campuran, dan kondisi lingkungan. Minimum reservasi adalah 1 sampel. Estimasi maksimal penyelesaian laporan adalah 21 hari kerja.",
                "images" => ["test_images/MDB.jpeg"],
                "price" => 1500000,
                "minimum_unit" => 1,
                "daily_slot" => 1,
                "laboratory_id" => 3,
                "category_id" => 1
            ],
            [
                "name" => "Uji Tekan Material (Alat Digital)",
                "description" => "Uji Tekan Material (Alat Digital) adalah metode pengujian yang digunakan untuk menentukan kekuatan tekan material seperti beton, batu, atau logam dengan menggunakan alat digital yang memberikan hasil pengukuran secara akurat dan cepat. Minimum reservasi adalah 1 sampel. Estimasi maksimal penyelesaian laporan adalah 3 hari kerja.",
                "images" => ["test_images/UTMD.jpg"],
                "price" => 150000,
                "minimum_unit" => 1,
                "daily_slot" => 50,
                "laboratory_id" => 3,
                "category_id" => 1
            ],
            [
                "name" => "Berat Volume Material",
                "description" => "Uji Berat Volume Material adalah metode pengujian yang digunakan untuk menentukan berat volume material seperti tanah, agregat, atau bahan bangunan lainnya dengan cara mengukur massa dan volume material tersebut. Minimum reservasi adalah 1 sampel. Estimasi maksimal penyelesaian laporan adalah 3 hari kerja untuk satuan dan 7 hari kerja untuk paket kumplit.",
                "images" => ["test_images/LSBB.jpeg"],
                "price" => 150000,
                "minimum_unit" => 1,
                "daily_slot" => 2,
                "laboratory_id" => 3,
                "category_id" => 1
            ],
            [
                "name" => "Core Drill Beton",
                "description" => "Core Drill Beton adalah metode pengambilan sampel beton dari struktur yang ada untuk analisis lebih lanjut, seperti pengujian kekuatan atau karakteristik lainnya. Minimum reservasi adalah 5 titik. Estimasi maksimal penyelesaian laporan adalah 14 hari kerja. (Biaya utama belum termasuk biaya survei, transportasi, dan akomodasi)",
                "images" => ["test_images/CDB.jpeg"],
                "price" => 250000,
                "minimum_unit" => 5,
                "daily_slot" => 5,
                "laboratory_id" => 3,
                "category_id" => 2
            ],
            [
                "name" => "Uji Kekekalan Agregat",
                "description" => "Uji Kekekalan Agregat adalah metode pengujian yang digunakan untuk menentukan ketahanan agregat terhadap pelapukan dan degradasi akibat pengaruh lingkungan, seperti air, udara, dan bahan kimia. Minimum reservasi adalah 1 sampel. Estimasi maksimal penyelesaian laporan adalah 3 hari kerja untuk satuan dan 7 hari kerja untuk paket kumplit.",
                "images" => ["test_images/LSBB.jpeg"],
                "price" => 250000,
                "minimum_unit" => 1,
                "daily_slot" => 2,
                "laboratory_id" => 3,
                "category_id" => 1
            ],
            [
                "name" => "Uji Kepipihan Agregat",
                "description" => "Uji Kepipihan Agregat adalah metode pengujian yang digunakan untuk menentukan persentase kepipihan atau bentuk pipih dari butiran agregat, yang dapat mempengaruhi kualitas dan kinerja campuran beton atau aspal. Minimum reservasi adalah 1 sampel. Estimasi maksimal penyelesaian laporan adalah 3 hari kerja untuk satuan dan 7 hari kerja untuk paket kumplit.",
                "images" => ["test_images/LSBB.jpeg"],
                "price" => 200000,
                "minimum_unit" => 1,
                "daily_slot" => 2,
                "laboratory_id" => 3,
                "category_id" => 1
            ],
            [
                "name" => "Berat Jenis Besi",
                "description" => "Uji Berat Jenis Besi adalah metode pengujian yang digunakan untuk menentukan berat jenis atau densitas besi dengan cara mengukur massa dan volume besi tersebut. Minimum reservasi adalah 1 sampel. Estimasi maksimal penyelesaian laporan adalah 3 hari kerja. (Biaya utama belum termasuk biaya survei, transportasi, dan akomodasi)",
                "images" => ["test_images/BJB.jpeg"],
                "price" => 200000,
                "minimum_unit" => 1,
                "daily_slot" => 2,
                "laboratory_id" => 3,
                "category_id" => 1
            ],
            [
                "name" => "Hammer Test",
                "description" => "Hammer Test adalah metode pengujian non-destruktif yang digunakan untuk menilai kekuatan permukaan beton dengan cara memukul permukaan beton menggunakan palu khusus dan mengukur pantulan energi yang dihasilkan. Minimum reservasi adalah 10 titik. Estimasi maksimal penyelesaian laporan adalah 14 hari kerja. (Biaya utama belum termasuk biaya survei, transportasi, dan akomodasi)",
                "images" => ["test_images/HT.jpeg"],
                "price" => 100000,
                "minimum_unit" => 10,
                "daily_slot" => 10,
                "laboratory_id" => 3,
                "category_id" => 2
            ],
            [
                "name" => "Uji Sondir",
                "description" => "Uji Sondir adalah metode pengujian tanah yang digunakan untuk menentukan sifat fisik dan mekanik tanah dengan cara menekan alat sondir ke dalam tanah dan mengukur tahanan yang dihasilkan. Minimum reservasi adalah 2 titik. Estimasi maksimal penyelesaian laporan adalah 14 hari kerja. (Biaya utama belum termasuk biaya survei, transportasi, dan akomodasi)",
                "images" => ["test_images/US.jpeg"],
                "price" => 850000,
                "minimum_unit" => 2,
                "daily_slot" => 2,
                "laboratory_id" => 5,
                "category_id" => 2
            ],
            [
                "name" => "Uji Bor Tangan",
                "description" => "Uji Bor Tangan adalah metode pengujian tanah yang digunakan untuk mengambil sampel tanah dari kedalaman tertentu dengan menggunakan alat bor tangan, sehingga dapat dianalisis lebih lanjut di laboratorium. Minimum reservasi adalah 3 titik. Estimasi maksimal penyelesaian laporan adalah 14 hari kerja. (Biaya utama belum termasuk biaya survei, transportasi, dan akomodasi)",
                "images" => ["test_images/UBT.jpeg"],
                "price" => 500000,
                "minimum_unit" => 3,
                "daily_slot" => 3,
                "laboratory_id" => 5,
                "category_id" => 2
            ],
            [
                "name" => "Uji Kadar Air Tanah",
                "description" => "Uji Kadar Air Tanah adalah metode pengujian yang digunakan untuk menentukan persentase kadar air dalam sampel tanah, yang dapat mempengaruhi sifat fisik dan mekanik tanah tersebut. Minimum reservasi adalah 1 sampel. Estimasi maksimal penyelesaian laporan adalah 3 hari kerja dan 14 hari kerja untuk paket kumplit.",
                "images" => ["test_images/LMT.jpeg"],
                "price" => 150000,
                "minimum_unit" => 1,
                "daily_slot" => 2,
                "laboratory_id" => 5,
                "category_id" => 1
            ],
            [
                "name" => "Uji Berat Jenis Tanah",
                "description" => "Uji Berat Jenis Tanah adalah metode pengujian yang digunakan untuk menentukan berat jenis atau densitas tanah dengan cara mengukur massa dan volume tanah tersebut. Minimum reservasi adalah 1 sampel. Estimasi maksimal penyelesaian laporan adalah 3 hari kerja dan 14 hari kerja untuk paket kumplit.",
                "images" => ["test_images/LMT.jpeg"],
                "price" => 150000,
                "minimum_unit" => 1,
                "daily_slot" => 2,
                "laboratory_id" => 5,
                "category_id" => 1
            ],
            [
                "name" => "Uji Gradasi Tanah",
                "description" => "Uji Gradasi Tanah adalah metode pengujian yang digunakan untuk menentukan distribusi ukuran butiran dalam sampel tanah, yang dapat mempengaruhi sifat fisik dan mekanik tanah tersebut. Minimum reservasi adalah 1 sampel. Estimasi maksimal penyelesaian laporan adalah 3 hari kerja dan 14 hari kerja untuk paket kumplit.",
                "images" => ["test_images/UGT.jpeg"],
                "price" => 200000,
                "minimum_unit" => 1,
                "daily_slot" => 2,
                "laboratory_id" => 5,
                "category_id" => 1
            ],
            [
                "name" => "Uji Batas Cair dan Batas Plastis Tanah",
                "description" => "Uji Batas Cair dan Batas Plastis Tanah adalah metode pengujian yang digunakan untuk menentukan batas cair dan batas plastis tanah, yang dapat mempengaruhi sifat fisik dan mekanik tanah tersebut. Minimum reservasi adalah 1 sampel. Estimasi maksimal penyelesaian laporan adalah 3 hari kerja dan 14 hari kerja untuk paket kumplit.",
                "images" => ["test_images/LMT.jpeg"],
                "price" => 150000,
                "minimum_unit" => 1,
                "daily_slot" => 2,
                "laboratory_id" => 5,
                "category_id" => 1
            ],
        ];
    }
}
