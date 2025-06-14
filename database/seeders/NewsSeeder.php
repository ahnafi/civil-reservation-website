<?php

namespace Database\Seeders;

use App\Models\News;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        News::query()->delete(); // Clear existing news records

        $newsData = [
            [
                'title' => 'Pembangunan Jembatan Suramadu Fase 2 Dimulai',
                'content' => 'Pembangunan fase kedua dari Jembatan Suramadu telah dimulai. Proyek ini diperkirakan akan selesai dalam waktu 3 tahun dan akan meningkatkan konektivitas antara Surabaya dan Madura.Proyek ambisius ini melibatkan teknologi terdepan dalam konstruksi jembatan dan diharapkan dapat meningkatkan perekonomian daerah secara signifikan.',
                'thumbnail' => 'news_thumbnails/suramadu-bridge.jpg',
                'author_id' => 1,
                'news_category_id' => 1,
            ],
            [
                'title' => 'Perusahaan Memenangkan Tender Proyek Bendungan',
                'content' => 'PT Sipil Jaya berhasil memenangkan tender untuk proyek pembangunan bendungan di Jawa Barat. Proyek senilai 2 triliun rupiah ini akan menjadi salah satu bendungan terbesar di Indonesia.Bendungan ini diharapkan dapat mengatasi masalah kekeringan di wilayah Jawa Barat dan sekitarnya, serta menyediakan pasokan air yang stabil untuk kebutuhan industri dan rumah tangga.',
                'thumbnail' => 'news_thumbnails/dam-project.jpg',
                'author_id' => 2,
                'news_category_id' => 2,
            ],
            [
                'title' => 'Teknologi Baru dalam Konstruksi Ramah Lingkungan',
                'content' => 'Inovasi terbaru dalam teknologi konstruksi ramah lingkungan telah diperkenalkan dalam pameran tahunan. Material bangunan ini dapat mengurangi emisi karbon hingga 40%.Teknologi ini menggunakan material daur ulang dan proses produksi yang lebih efisien energi, menjadikannya solusi ideal untuk pembangunan berkelanjutan di masa depan.',
                'thumbnail' => 'news_thumbnails/eco-construction.jpg',
                'author_id' => 3,
                'news_category_id' => 3,
            ],
            [
                'title' => 'Pelatihan Teknik Sipil untuk Mahasiswa',
                'content' => 'Program pelatihan teknik sipil untuk mahasiswa telah diluncurkan sebagai bagian dari kerjasama antara industri dan perguruan tinggi untuk meningkatkan kualitas lulusan.Program ini mencakup pelatihan praktis di lapangan, workshop teknologi terbaru, dan magang di perusahaan-perusahaan konstruksi terkemuka.',
                'thumbnail' => 'news_thumbnails/civil-training.jpg',
                'author_id' => 4,
                'news_category_id' => 4,
            ],
            [
                'title' => 'Proyek Renovasi Gedung Bersejarah',
                'content' => 'Renovasi gedung bersejarah di pusat kota telah dimulai. Proyek ini bertujuan untuk melestarikan nilai sejarah sambil meningkatkan struktur dan keamanan gedung.Tim ahli konservasi bekerja sama dengan insinyur struktur untuk memastikan renovasi dilakukan dengan standar internasional sambil mempertahankan keaslian arsitektur bangunan.',
                'thumbnail' => 'news_thumbnails/historical-building.jpg',
                'author_id' => 5,
                'news_category_id' => 5,
            ],
        ];

        foreach ($newsData as $news) {
            News::create($news);
        }
    }
}
