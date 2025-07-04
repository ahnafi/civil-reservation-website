<?php

namespace Database\Seeders;

use App\Models\Test;
use App\Models\Package;
use Illuminate\Database\Seeder;
use App\Models\Submission;
use App\Models\SubmissionInternalDetail;
use App\Models\SubmissionExternalDetail;
use App\Models\SubmissionTest;
use App\Models\SubmissionPackage;
use Carbon\Carbon;

class SubmissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1: Admin
        // 2: External User
        // 3: Internal User
        // 4: External User
        // 5: Internal User

        $now = Carbon::now();

        $externalDetails = [
            [ // 1
                'company_name'  => 'PT. Rancang Bangun Asia',
                'project_name'  => 'Pembangunan Jembatan',
                'project_address' => 'Jl. Raya No. 1',
                'created_at'    => $now->copy()->subDays(rand(0, 2)),
                'updated_at'    => $now->copy()->subDays(rand(0, 2)),
            ],
            [ // 2
                'company_name'  => 'PT. Konstruksi Nusantara',
                'project_name'  => 'Gedung Perkantoran',
                'project_address' => 'Jl. Merdeka No. 2',
                'created_at'    => $now->copy()->subDays(rand(3, 90)),
                'updated_at'    => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 3
                'company_name'  => 'PT. Bangun Sejahtera',
                'project_name'  => 'Pembangunan Rumah Sakit',
                'project_address' => 'Jl. Sehat No. 3',
                'created_at'    => $now->copy()->subDays(rand(3, 90)),
                'updated_at'    => $now->copy()->subDays(rand(3, 90))
            ],
            [ // 4
                'company_name'  => 'PT. Maju Jaya',
                'project_name'  => 'Pembangunan Sekolah',
                'project_address' => 'Jl. Pendidikan No. 4',
                'created_at'    => $now->copy()->subDays(rand(0, 2)),
                'updated_at'    => $now->copy()->subDays(rand(0, 2)),
            ],
            [ // 5
                'company_name'  => 'PT. Karya Mandiri',
                'project_name'  => 'Pembangunan Mall',
                'project_address' => 'Jl. Belanja No. 5',
                'created_at'    => $now->copy()->subDays(rand(3, 90)),
                'updated_at'    => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 6
                'company_name'  => 'PT. Sukses Bersama',
                'project_name'  => 'Pembangunan Hotel',
                'project_address' => 'Jl. Wisata No. 6',
                'created_at'    => $now->copy()->subDays(rand(3, 90)),
                'updated_at'    => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 7
                'company_name'  => 'PT. Cipta Karya',
                'project_name'  => 'Pembangunan Apartemen',
                'project_address' => 'Jl. Hunian No. 7',
                'created_at'    => $now->copy()->subDays(rand(0, 2)),
                'updated_at'    => $now->copy()->subDays(rand(0, 2)),
            ],
            [ // 8
                'company_name'  => 'PT. Mega Konstruksi',
                'project_name'  => 'Pembangunan Pabrik',
                'project_address' => 'Jl. Industri No. 8',
                'created_at'    => $now->copy()->subDays(rand(3, 90)),
                'updated_at'    => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 9
                'company_name'  => 'PT. Prima Jaya',
                'project_name'  => 'Pembangunan Gudang',
                'project_address' => 'Jl. Logistik No. 9',
                'created_at'    => $now->copy()->subDays(rand(3, 90)),
                'updated_at'    => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 10
                'company_name'  => 'PT. Karya Utama',
                'project_name'  => 'Pembangunan Stadion',
                'project_address' => 'Jl. Olahraga No. 10',
                'created_at'    => $now->copy()->subDays(rand(0, 2)),
                'updated_at'    => $now->copy()->subDays(rand(0, 2)),
            ],
            [ // 11
                'company_name'  => 'PT. Bangun Persada',
                'project_name'  => 'Pembangunan Pelabuhan',
                'project_address' => 'Jl. Laut No. 11',
                'created_at'    => $now->copy()->subDays(rand(3, 90)),
                'updated_at'    => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 12
                'company_name'  => 'PT. Konstruksi Abadi',
                'project_name'  => 'Pembangunan Bandara',
                'project_address' => 'Jl. Udara No. 12',
                'created_at'    => $now->copy()->subDays(rand(3, 90)),
                'updated_at'    => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 13
                'company_name'  => 'PT. Maju Terus',
                'project_name'  => 'Pembangunan Jalan Tol',
                'project_address' => 'Jl. Tol No. 13',
                'created_at'    => $now->copy()->subDays(rand(0, 2)),
                'updated_at'    => $now->copy()->subDays(rand(0, 2)),
            ],
            [ // 14
                'company_name'  => 'PT. Karya Sejahtera',
                'project_name'  => 'Pembangunan Bendungan',
                'project_address' => 'Jl. Air No. 14',
                'created_at'    => $now->copy()->subDays(rand(3, 90)),
                'updated_at'    => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 15
                'company_name'  => 'PT. Sukses Makmur',
                'project_name'  => 'Pembangunan Taman',
                'project_address' => 'Jl. Hijau No. 15',
                'created_at'    => $now->copy()->subDays(rand(3, 90)),
                'updated_at'    => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 16
                'company_name'  => 'PT. Cipta Mandiri',
                'project_name'  => 'Pembangunan Perumahan',
                'project_address' => 'Jl. Rumah No. 16',
                'created_at'    => $now->copy()->subDays(rand(0, 2)),
                'updated_at'    => $now->copy()->subDays(rand(0, 2)),
            ],
            [ // 17
                'company_name'  => 'PT. Mega Sejahtera',
                'project_name'  => 'Pembangunan Pasar',
                'project_address' => 'Jl. Pasar No. 17',
                'created_at'    => $now->copy()->subDays(rand(3, 90)),
                'updated_at'    => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 18
                'company_name'  => 'PT. Prima Karya',
                'project_name'  => 'Pembangunan Terminal',
                'project_address' => 'Jl. Transportasi No. 18',
                'created_at'    => $now->copy()->subDays(rand(3, 90)),
                'updated_at'    => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 19
                'company_name'  => 'PT. Karya Bersama',
                'project_name'  => 'Pembangunan Pusat Perbelanjaan',
                'project_address' => 'Jl. Belanja No. 19',
                'created_at'    => $now->copy()->subDays(rand(0, 2)),
                'updated_at'    => $now->copy()->subDays(rand(0, 2)),
            ],
            [ // 20
                'company_name'  => 'PT. Maju Bersama',
                'project_name'  => 'Pembangunan Pusat Kebudayaan',
                'project_address' => 'Jl. Budaya No. 20',
                'created_at'    => $now->copy()->subDays(rand(3, 90)),
                'updated_at'    => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 21
                'company_name'  => 'PT. Inovasi Teknologi',
                'project_name'  => 'Pembangunan Data Center',
                'project_address' => 'Jl. Teknologi No. 21',
                'created_at'    => $now->copy()->subDays(rand(3, 90)),
                'updated_at'    => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 22
                'company_name'  => 'PT. Solusi Bangun',
                'project_name'  => 'Pembangunan Gedung IT',
                'project_address' => 'Jl. Solusi No. 22',
                'created_at'    => $now->copy()->subDays(rand(3, 90)),
                'updated_at'    => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 23
                'company_name'  => 'PT. Karya Digital',
                'project_name'  => 'Pembangunan Kantor Digital',
                'project_address' => 'Jl. Digital No. 23',
                'created_at'    => $now->copy()->subDays(rand(3, 90)),
                'updated_at'    => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 24
                'company_name'  => 'PT. Bangun Kreatif',
                'project_name'  => 'Pembangunan Studio Kreatif',
                'project_address' => 'Jl. Kreatif No. 24',
                'created_at'    => $now->copy()->subDays(rand(3, 90)),
                'updated_at'    => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 25
                'company_name'  => 'PT. Inovasi Bangsa',
                'project_name'  => 'Pembangunan Pusat Inovasi',
                'project_address' => 'Jl. Inovasi No. 25',
                'created_at'    => $now->copy()->subDays(rand(3, 90)),
                'updated_at'    => $now->copy()->subDays(rand(3, 90)),
            ],
        ];

        $internalDetails = [
            [ // 1
                'name' => 'Ahmad Ramadhan',
                'program_study' => 'Teknik Sipil',
                'research_title' => 'Analisis Kekuatan Beton pada Bangunan Tinggi',
                'personnel_count' => 3,
                'supervisor' => 'Dr. Ir. Bambang Sugiarto',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 2
                'name' => 'Siti Nurhaliza',
                'program_study' => 'Teknik Sipil',
                'research_title' => 'Evaluasi Struktur Jembatan Gantung di Daerah Rawan Gempa',
                'personnel_count' => 2,
                'supervisor' => 'Ir. Sri Wahyuni, M.T.',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 3
                'name' => 'Budi Santoso',
                'program_study' => 'Teknik Sipil',
                'research_title' => 'Perancangan Saluran Drainase untuk Kawasan Perkotaan',
                'personnel_count' => 4,
                'supervisor' => 'Prof. Dr. Eng. Andi Wijaya',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 4
                'name' => 'Dewi Ayu Lestari',
                'program_study' => 'Teknik Sipil',
                'research_title' => 'Studi Stabilitas Lereng Menggunakan Metode Geoteknik',
                'personnel_count' => 2,
                'supervisor' => 'Dr. Yuli Astuti',
                'created_at' => $now->copy()->subDays(rand(0, 2)),
            ],
            [ // 5
                'name' => 'Rizky Pratama',
                'program_study' => 'Teknik Sipil',
                'research_title' => 'Pengaruh Cuaca Terhadap Mutu Jalan Aspal',
                'personnel_count' => 5,
                'supervisor' => 'Ir. Gunawan, M.Sc.',
                'created_at' => $now->copy()->subDays(rand(0, 2)),
            ],
            [ // 6
                'name' => 'Putri Maharani',
                'program_study' => 'Teknik Sipil',
                'research_title' => 'Simulasi Beban Angin pada Struktur Bangunan Bertingkat',
                'personnel_count' => 3,
                'supervisor' => 'Prof. Dr. Satrio Nugroho',
                'created_at' => $now->copy()->subDays(rand(5, 80)),
            ],
            [ // 7
                'name' => 'Agus Wijaya',
                'program_study' => 'Teknik Sipil',
                'research_title' => 'Pengaruh Jenis Agregat terhadap Daya Tahan Beton',
                'personnel_count' => 1,
                'supervisor' => 'Dr. Lia Hartati',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 8
                'name' => 'Nur Aini',
                'program_study' => 'Teknik Sipil',
                'research_title' => 'Analisis Risiko Proyek Konstruksi di Wilayah Perkotaan',
                'personnel_count' => 4,
                'supervisor' => 'Ir. Dimas Prabowo, M.T.',
                'created_at' => $now->copy()->subDays(rand(10, 90)),
            ],
            [ // 9
                'name' => 'Fajar Nugroho',
                'program_study' => 'Teknik Sipil',
                'research_title' => 'Evaluasi Material Ramah Lingkungan untuk Konstruksi Jalan',
                'personnel_count' => 5,
                'supervisor' => 'Dr. Nuraini Yusuf',
                'created_at' => $now->copy()->subDays(rand(0, 2)),
            ],
            [ // 10
                'name' => 'Dina Oktaviani',
                'program_study' => 'Teknik Sipil',
                'research_title' => 'Pemodelan Hidrologi pada Sistem Irigasi Pertanian',
                'personnel_count' => 2,
                'supervisor' => 'Ir. Rudi Hartono',
                'created_at' => $now->copy()->subDays(rand(5, 80)),
            ],
            [ // 11
                'name' => 'Yusuf Maulana',
                'program_study' => 'Teknik Sipil',
                'research_title' => 'Kajian Pemanfaatan Limbah Plastik untuk Aspal Jalan',
                'personnel_count' => 3,
                'supervisor' => 'Prof. Dian Anggraini',
                'created_at' => $now->copy()->subDays(rand(0, 2)),
            ],
            [ // 12
                'name' => 'Indah Puspita',
                'program_study' => 'Teknik Sipil',
                'research_title' => 'Rancang Bangun Jembatan Baja Sederhana untuk Pedesaan',
                'personnel_count' => 1,
                'supervisor' => 'Dr. Ir. Fajar Hidayat',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 13
                'name' => 'Reza Anugrah',
                'program_study' => 'Teknik Sipil',
                'research_title' => 'Penerapan BIM pada Proyek Gedung Bertingkat',
                'personnel_count' => 2,
                'supervisor' => 'Ir. Putri Yuliana',
                'created_at' => $now->copy()->subDays(rand(3, 60)),
            ],
            [ // 14
                'name' => 'Lestari Wulandari',
                'program_study' => 'Teknik Sipil',
                'research_title' => 'Perbandingan Sistem Pondasi untuk Tanah Lunak',
                'personnel_count' => 4,
                'supervisor' => 'Dr. Wahyu Ramadhan',
                'created_at' => $now->copy()->subDays(rand(0, 2)),
            ],
            [ // 15
                'name' => 'Andi Saputra',
                'program_study' => 'Teknik Sipil',
                'research_title' => 'Optimasi Biaya Proyek Konstruksi Menggunakan Metode Value Engineering',
                'personnel_count' => 3,
                'supervisor' => 'Dr. Ir. Andika Mahendra',
                'created_at' => $now->copy()->subDays(rand(5, 80)),
            ],
            [ // 16
                'name' => 'Wahyu Aditya',
                'program_study' => 'Teknik Sipil',
                'research_title' => 'Studi Penerapan Green Construction pada Bangunan Perkotaan',
                'personnel_count' => 5,
                'supervisor' => 'Prof. Siti Amalia',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
            ],
            [ // 17
                'name' => 'Melati Anjani',
                'program_study' => 'Teknik Sipil',
                'research_title' => 'Simulasi Aliran Lalu Lintas Menggunakan Software Mikrosimulasi',
                'personnel_count' => 2,
                'supervisor' => 'Ir. Bagus Hidayat',
                'created_at' => $now->copy()->subDays(rand(4, 50)),
            ],
            [ // 18
                'name' => 'Rudi Hartono',
                'program_study' => 'Teknik Sipil',
                'research_title' => 'Analisis Penurunan Tanah pada Struktur Bangunan di Daerah Pesisir',
                'personnel_count' => 1,
                'supervisor' => 'Dr. Tri Handayani',
                'created_at' => $now->copy()->subDays(rand(3, 70)),
            ],
            [ // 19
                'name' => 'Nurul Fadilah',
                'program_study' => 'Teknik Sipil',
                'research_title' => 'Kajian Sistem Pracetak dalam Proyek Konstruksi Cepat',
                'personnel_count' => 4,
                'supervisor' => 'Ir. Agus Kurniawan',
                'created_at' => $now->copy()->subDays(rand(0, 2)),
            ],
            [ // 20
                'name' => 'Teguh Wibowo',
                'program_study' => 'Teknik Sipil',
                'research_title' => 'Rekayasa Lalu Lintas di Persimpangan Padat',
                'personnel_count' => 2,
                'supervisor' => 'Prof. Rina Dewanti',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
            ],
        ];

        foreach ($internalDetails as &$details) {
            $details['updated_at'] = $details['created_at'];
        }
        unset($details);

        foreach ($externalDetails as $details) {
            SubmissionExternalDetail::create($details);
        }

        foreach ($internalDetails as $details) {
            SubmissionInternalDetail::create($details);
        }

        $submissions = [
            [ // 1 submitted
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 1,
                'status' => 'submitted',
                'created_at' => $now->copy()->subDays(rand(0, 2)),
                'test_submission_date' => $now->copy()->addDays(rand(7, 14)),
            ],
            [ // 2 approved
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 2,
                'status' => 'approved',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-60, 30)),
            ],
            [ // 3 rejected
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 3,
                'status' => 'rejected',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-60, 30)),
            ],
            [ // 4 submitted
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 4,
                'status' => 'submitted',
                'created_at' => $now->copy()->subDays(rand(0, 2)),
                'test_submission_date' => $now->copy()->addDays(rand(7, 14)),
            ],
            [ // 5 approved
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 5,
                'status' => 'approved',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-60, 30)),
            ],
            [ // 6 rejected
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 6,
                'status' => 'rejected',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-60, 30)),
            ],
            [ // 7 submitted
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 7,
                'status' => 'submitted',
                'created_at' => $now->copy()->subDays(rand(0, 2)),
                'test_submission_date' => $now->copy()->addDays(rand(7, 14)),
            ],
            [ // 8 approved
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 8,
                'status' => 'approved',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-60, 30)),
            ],
            [ // 9 rejected
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 9,
                'status' => 'rejected',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-60, 30)),
            ],
            [ // 10 submitted
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 10,
                'status' => 'submitted',
                'created_at' => $now->copy()->subDays(rand(0, 2)),
                'test_submission_date' => $now->copy()->addDays(rand(7, 14)),
            ],
            [ // 11 approved
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 11,
                'status' => 'approved',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-60, 30)),
            ],
            [ // 12 rejected
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 12,
                'status' => 'rejected',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-60, 30)),
            ],
            [ // 13 submitted
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 13,
                'status' => 'submitted',
                'created_at' => $now->copy()->subDays(rand(0, 2)),
                'test_submission_date' => $now->copy()->addDays(rand(7, 14)),
            ],
            [ // 14 approved
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 14,
                'status' => 'approved',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-60, 30)),
            ],
            [ // 15 rejected
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 15,
                'status' => 'rejected',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-60, 30)),
            ],
            [ // 16 submitted
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 16,
                'status' => 'submitted',
                'created_at' => $now->copy()->subDays(rand(0, 2)),
                'test_submission_date' => $now->copy()->addDays(rand(7, 14)),
            ],
            [ // 17 approved
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 17,
                'status' => 'approved',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-60, 30)),
            ],
            [ // 18 rejected
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 18,
                'status' => 'rejected',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-60, 30)),
            ],
            [ // 19 submitted
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 19,
                'status' => 'submitted',
                'created_at' => $now->copy()->subDays(rand(0, 2)),
                'test_submission_date' => $now->copy()->addDays(rand(7, 14)),
            ],
            [ // 20 approved
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 20,
                'status' => 'approved',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-60, 30)),
            ],
            [ // 21 approved
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 21,
                'status' => 'approved',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-60, 30)),
            ],
            [ // 22 approved
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 22,
                'status' => 'approved',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-60, 30)),
            ],
            [ // 23 approved
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 23,
                'status' => 'approved',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-60, 30)),
            ],
            [ // 24 approved
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 24,
                'status' => 'approved',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-60, 30)),
            ],
            [ // 25 approved
                'user_id' => 4,
                'submission_type' => 'external',
                'submission_external_detail_id' => 25,
                'status' => 'approved',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-60, 30)),
            ],
            [ // 26 approved
                'user_id' => 5,
                'submission_type' => 'internal',
                'submission_internal_detail_id' => 1,
                'status' => 'approved',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->subDays(rand(30, 60)),
            ],
            [ // 27 approved
                'user_id' => 5,
                'submission_type' => 'internal',
                'submission_internal_detail_id' => 2,
                'status' => 'approved',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(10, 30)),
            ],
            [ // 28 rejected
                'user_id' => 5,
                'submission_type' => 'internal',
                'submission_internal_detail_id' => 3,
                'status' => 'rejected',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->subDays(rand(20, 60)),
            ],
            [ // 29 submitted
                'user_id' => 5,
                'submission_type' => 'internal',
                'submission_internal_detail_id' => 4,
                'status' => 'submitted',
                'created_at' => $now->copy()->subDays(rand(0, 2)),
                'test_submission_date' => $now->copy()->addDays(rand(7, 14)),
            ],
            [ // 30 submitted
                'user_id' => 5,
                'submission_type' => 'internal',
                'submission_internal_detail_id' => 5,
                'status' => 'submitted',
                'created_at' => $now->copy()->subDays(rand(0, 2)),
                'test_submission_date' => $now->copy()->addDays(rand(7, 21)),
            ],
            [ // 31 rejected
                'user_id' => 5,
                'submission_type' => 'internal',
                'submission_internal_detail_id' => 6,
                'status' => 'rejected',
                'created_at' => $now->copy()->subDays(rand(5, 80)),
                'test_submission_date' => $now->copy()->addDays(rand(-60, 30)),
            ],
            [ // 32 approved
                'user_id' => 5,
                'submission_type' => 'internal',
                'submission_internal_detail_id' => 7,
                'status' => 'approved',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-40, 30)),
            ],
            [ // 33 rejected
                'user_id' => 5,
                'submission_type' => 'internal',
                'submission_internal_detail_id' => 8,
                'status' => 'rejected',
                'created_at' => $now->copy()->subDays(rand(10, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-30, 20)),
            ],
            [ // 34 submitted
                'user_id' => 5,
                'submission_type' => 'internal',
                'submission_internal_detail_id' => 9,
                'status' => 'submitted',
                'created_at' => $now->copy()->subDays(rand(0, 2)),
                'test_submission_date' => $now->copy()->addDays(rand(10, 20)),
            ],
            [ // 35 approved
                'user_id' => 5,
                'submission_type' => 'internal',
                'submission_internal_detail_id' => 10,
                'status' => 'approved',
                'created_at' => $now->copy()->subDays(rand(5, 80)),
                'test_submission_date' => $now->copy()->addDays(rand(-50, 30)),
            ],
            [ // 36 submitted
                'user_id' => 5,
                'submission_type' => 'internal',
                'submission_internal_detail_id' => 11,
                'status' => 'submitted',
                'created_at' => $now->copy()->subDays(rand(0, 2)),
                'test_submission_date' => $now->copy()->addDays(rand(7, 14)),
            ],
            [ // 37 approved
                'user_id' => 5,
                'submission_type' => 'internal',
                'submission_internal_detail_id' => 12,
                'status' => 'approved',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-30, 20)),
            ],
            [ // 38 rejected
                'user_id' => 5,
                'submission_type' => 'internal',
                'submission_internal_detail_id' => 13,
                'status' => 'rejected',
                'created_at' => $now->copy()->subDays(rand(3, 60)),
                'test_submission_date' => $now->copy()->addDays(rand(-50, 10)),
            ],
            [ // 39 submitted
                'user_id' => 5,
                'submission_type' => 'internal',
                'submission_internal_detail_id' => 14,
                'status' => 'submitted',
                'created_at' => $now->copy()->subDays(rand(0, 2)),
                'test_submission_date' => $now->copy()->addDays(rand(10, 20)),
            ],
            [ // 40 approved
                'user_id' => 5,
                'submission_type' => 'internal',
                'submission_internal_detail_id' => 15,
                'status' => 'approved',
                'created_at' => $now->copy()->subDays(rand(5, 80)),
                'test_submission_date' => $now->copy()->addDays(rand(-30, 20)),
            ],
            [ // 41 rejected
                'user_id' => 5,
                'submission_type' => 'internal',
                'submission_internal_detail_id' => 16,
                'status' => 'rejected',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-60, 30)),
            ],
            [ // 42 approved
                'user_id' => 5,
                'submission_type' => 'internal',
                'submission_internal_detail_id' => 17,
                'status' => 'approved',
                'created_at' => $now->copy()->subDays(rand(4, 50)),
                'test_submission_date' => $now->copy()->addDays(rand(-45, 25)),
            ],
            [ // 43 rejected
                'user_id' => 5,
                'submission_type' => 'internal',
                'submission_internal_detail_id' => 18,
                'status' => 'rejected',
                'created_at' => $now->copy()->subDays(rand(3, 70)),
                'test_submission_date' => $now->copy()->addDays(rand(-50, 10)),
            ],
            [ // 44 submitted
                'user_id' => 5,
                'submission_type' => 'internal',
                'submission_internal_detail_id' => 19,
                'status' => 'submitted',
                'created_at' => $now->copy()->subDays(rand(0, 2)),
                'test_submission_date' => $now->copy()->addDays(rand(7, 14)),
            ],
            [ // 45 approved
                'user_id' => 5,
                'submission_type' => 'internal',
                'submission_internal_detail_id' => 20,
                'status' => 'approved',
                'created_at' => $now->copy()->subDays(rand(3, 90)),
                'test_submission_date' => $now->copy()->addDays(rand(-60, 30)),
            ]
        ];

        foreach ($submissions as &$submission) {
            $submission['updated_at'] = $submission['created_at'];
        }
        unset($submission);

        foreach ($submissions as $submission) {
            Submission::create($submission);
        }

        $submissionTests = [
            [
                'submission_id' => 1,
                'test_id'       => 2,
                'quantity'      => 1,
            ],
            [
                'submission_id' => 1,
                'test_id'       => 3,
                'quantity'      => 2,
            ],
            [
                'submission_id' => 3,
                'test_id'       => 4,
                'quantity'      => 1,
            ],
            [
                'submission_id' => 3,
                'test_id'       => 5,
                'quantity'      => 1,
            ],
            [
                'submission_id' => 4,
                'test_id' => 3,
                'quantity' => 3,
            ],
            [
                'submission_id' => 6,
                'test_id'       => 7,
                'quantity'      => 2,
            ],
            [
                'submission_id' => 6,
                'test_id'       => 8,
                'quantity'      => 1,
            ],
            [
                'submission_id' => 7,
                'test_id' => 5,
                'quantity' => 1,
            ],
            [
                'submission_id' => 9,
                'test_id' => 6,
                'quantity' => 2,
            ],
            [
                'submission_id' => 10,
                'test_id'       => 9,
                'quantity'      => 1,
            ],
            [
                'submission_id' => 10,
                'test_id'       => 10,
                'quantity'      => 1,
            ],
            [
                'submission_id' => 10,
                'test_id'       => 11,
                'quantity'      => 1,
            ],
            [
                'submission_id' => 12,
                'test_id' => 8,
                'quantity' => 3,
            ],
            [
                'submission_id' => 13,
                'test_id' => 9,
                'quantity' => 2,
            ],
            [
                'submission_id' => 15,
                'test_id' => 10,
                'quantity' => 1,
            ],
            [
                'submission_id' => 16,
                'test_id' => 11,
                'quantity' => 2,
            ],
            [
                'submission_id' => 18,
                'test_id' => 12,
                'quantity' => 1,
            ],
            [
                'submission_id' => 19,
                'test_id' => 13,
                'quantity' => 3,
            ],
            [
                'submission_id' => 21,
                'test_id' => 6,
                'quantity' => 2,
            ],
            [

                'submission_id' => 22,
                'test_id'       => 1,
                'quantity'      => 2,
            ],
            [
                'submission_id' => 24,
                'test_id'       => 2,
                'quantity'      => 1,
            ],
            [
                'submission_id' => 26,
                'test_id'       => 3,
                'quantity'      => 3,
            ],
            [
                'submission_id' => 26,
                'test_id'       => 4,
                'quantity'      => 1,
            ],
            [
                'submission_id' => 28,
                'test_id'       => 4,
                'quantity'      => 1,
            ],
            [
                'submission_id' => 28,
                'test_id'       => 5,
                'quantity'      => 2,
            ],
            [
                'submission_id' => 30,
                'test_id'       => 6,
                'quantity'      => 1,
            ],
            [
                'submission_id' => 30,
                'test_id'       => 5,
                'quantity'      => 2,
            ],
            [
                'submission_id' => 32,
                'test_id'       => 6,
                'quantity'      => 1,
            ],
            [
                'submission_id' => 34,
                'test_id'       => 7,
                'quantity'      => 3,
            ],
            [
                'submission_id' => 36,
                'test_id'       => 8,
                'quantity'      => 1,
            ],
            [
                'submission_id' => 38,
                'test_id'       => 9,
                'quantity'      => 2,
            ],
            [
                'submission_id' => 40,
                'test_id'       => 10,
                'quantity'      => 1,
            ],
            [
                'submission_id' => 40,
                'test_id'       => 11,
                'quantity'      => 2,
            ],
            [
                'submission_id' => 42,
                'test_id'       => 11,
                'quantity'      => 3,
            ],
            [
                'submission_id' => 44,
                'test_id'       => 12,
                'quantity'      => 1,
            ],
        ];

        $submissionIds = collect($submissionTests)->pluck('submission_id')->unique();
        $submissionMaps = Submission::whereIn('id', $submissionIds)->get()->keyBy('id');

        foreach ($submissionTests as &$submissionTest) {
            $createdAt = $submissionMaps[$submissionTest['submission_id']]->created_at ?? now();
            $submissionTest['created_at'] = $createdAt;
            $submissionTest['updated_at'] = $createdAt;
        }
        unset($submissionTest);

        $submissionPackages = [
            [
                'submission_id' => 2,
                'package_id' => 1,
            ],
            [
                'submission_id' => 5,
                'package_id' => 2,
            ],
            [
                'submission_id' => 8,
                'package_id' => 3,
            ],
            [
                'submission_id' => 11,
                'package_id' => 4,
            ],
            [
                'submission_id' => 14,
                'package_id' => 5,
            ],
            [
                'submission_id' => 17,
                'package_id' => 1,
            ],
            [
                'submission_id' => 20,
                'package_id' => 2,
            ],
            [
                'submission_id' => 23,
                'package_id'    => 1,
            ],
            [
                'submission_id' => 25,
                'package_id'    => 2,
            ],
            [
                'submission_id' => 27,
                'package_id'    => 3,
            ],
            [
                'submission_id' => 29,
                'package_id'    => 4,
            ],
            [
                'submission_id' => 31,
                'package_id'    => 5,
            ],
            [
                'submission_id' => 33,
                'package_id'    => 1,
            ],
            [
                'submission_id' => 35,
                'package_id'    => 2,
            ],
            [
                'submission_id' => 37,
                'package_id'    => 3,
            ],
            [
                'submission_id' => 39,
                'package_id'    => 4,
            ],
            [
                'submission_id' => 41,
                'package_id'    => 5,
            ],
            [
                'submission_id' => 43,
                'package_id'    => 1,
            ],
            [
                'submission_id' => 45,
                'package_id'    => 3,
            ]
        ];

        $packageSubmissionIds = collect($submissionPackages)->pluck('submission_id')->unique();
        $submissionMap = Submission::whereIn('id', $packageSubmissionIds)->get()->keyBy('id');

        foreach ($submissionPackages as &$submissionPackage) {
            $createdAt = $submissionMap[$submissionPackage['submission_id']]->created_at ?? now();
            $submissionPackage['created_at'] = $createdAt;
            $submissionPackage['updated_at'] = $createdAt;
        }
        unset($submissionPackage);


        foreach ($submissionPackages as $submissionPackage) {
            SubmissionPackage::create($submissionPackage);
        }

        foreach ($submissionTests as $submissionTest) {
            SubmissionTest::create($submissionTest);
        }

        $externalSubmissionIds = Submission::where('submission_type', 'external')->pluck('submission_external_detail_id')->unique();

        $externalDetailMaps = SubmissionExternalDetail::whereIn('id', $externalSubmissionIds)->get()->keyBy('id');

        $testsMap = Test::all()->keyBy('id');
        $packagesMap = Package::all()->keyBy('id');

        foreach ($externalDetailMaps as $externalDetailMap) {
            $totalCost = 0;

            $submission = Submission::where('submission_external_detail_id', $externalDetailMap->id)->first();

            if (!$submission) continue;

            $tests = SubmissionTest::where('submission_id', $submission->id)->get();

            foreach ($tests as $test) {
                $testCost = $testsMap[$test->test_id]->price * $test->quantity;
                $totalCost += $testCost * $test->quantity;
            }

            $packages = SubmissionPackage::where('submission_id', $submission->id)->get();

            foreach ($packages as $package) {
                $packageCost = $packagesMap[$package->package_id]->price;
                $totalCost += $packageCost;
            }

            $externalDetailMap->total_cost = $totalCost;
            $externalDetailMap->save();
        }
    }
}
