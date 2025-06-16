<?php

namespace Database\Seeders;

use App\Models\Download;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DownloadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $downloads = [
            [
                'title' => 'Panduan Akademik Teknik Sipil 2024/2025',
                'description' => 'Buku panduan akademik untuk mahasiswa Teknik Sipil tahun ajaran 2024/2025',
                'file' => 'downloadable_files/panduan_akademik_teknik_sipil_2024_2025.pdf',
            ],
            [
                'title' => 'Template Laporan KP',
                'description' => 'Template resmi untuk penulisan laporan Kerja Praktek mahasiswa Teknik Sipil',
                'file' => 'downloadable_files/template_laporan_kp.pdf',
            ],
            [
                'title' => 'Template Skripsi',
                'description' => 'Template resmi untuk penulisan skripsi mahasiswa Teknik Sipil',
                'file' => 'downloadable_files/template_skripsi.pdf',
            ],
        ];


        foreach ($downloads as $download) {
            Download::create($download);
        }
    }
}
