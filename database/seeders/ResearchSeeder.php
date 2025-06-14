<?php

namespace Database\Seeders;

use App\Models\Research;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ResearchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $researches = [
            [
            'title' => 'Analisis Kekuatan Beton Mutu Tinggi pada Struktur Gedung Bertingkat',
            'author' => ['Dr. Ir. Budi Santoso, MT', 'Ir. Siti Aminah, MT'],
            'abstract' => 'Penelitian ini membahas pengaruh variasi campuran beton mutu tinggi terhadap kekuatan tekan dan tarik pada struktur gedung bertingkat di Indonesia.',
            'year' => 2022,
            'publication' => 'Jurnal Teknik Sipil Indonesia, Vol. 12, No. 3, 2022',
            'keywords' => ['beton mutu tinggi', 'struktur gedung', 'teknik sipil', 'kekuatan tekan'],
            'link' => 'https://sipil.ugm.ac.id/penelitian/beton-mutu-tinggi'
            ],
            [
            'title' => 'Studi Stabilitas Lereng pada Proyek Jalan Tol Trans Jawa',
            'author' => ['Ir. Andi Prasetyo, MT'],
            'abstract' => 'Penelitian ini bertujuan untuk menganalisis faktor-faktor yang mempengaruhi stabilitas lereng pada proyek pembangunan Jalan Tol Trans Jawa menggunakan metode geoteknik.',
            'year' => 2021,
            'publication' => 'Jurnal Geoteknik Indonesia, Vol. 8, No. 1, 2021',
            'keywords' => ['stabilitas lereng', 'geoteknik', 'jalan tol', 'analisis lereng'],
            'link' => 'https://sipil.its.ac.id/riset/stabilitas-lereng'
            ],
            [
            'title' => 'Pemanfaatan Limbah Plastik sebagai Bahan Campuran Aspal',
            'author' => ['Dr. Ir. Rina Dewi, MT', 'Ir. Ahmad Fauzi, MT'],
            'abstract' => 'Penelitian ini mengevaluasi penggunaan limbah plastik sebagai bahan tambahan dalam campuran aspal untuk meningkatkan daya tahan dan ramah lingkungan.',
            'year' => 2023,
            'publication' => 'Jurnal Material Sipil, Vol. 15, No. 2, 2023',
            'keywords' => ['limbah plastik', 'aspal', 'jalan raya', 'material ramah lingkungan'],
            'link' => 'https://sipil.ui.ac.id/penelitian/aspal-plastik'
            ],
        ];

        foreach ($researches as $research) {
            Research::create($research);
        }
    }
}
