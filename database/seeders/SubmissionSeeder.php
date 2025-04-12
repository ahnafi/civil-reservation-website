<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Submission;
use App\Models\SubmissionTest;
use App\Models\SubmissionPackage;

class SubmissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $submissions = [
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Rancang Bangun Asia',
                'project_name'  => 'Pembangunan Jembatan',
                'project_address' => 'Jl. Raya No. 1',
                'total_cost'    => 1000000,
                'test_submission_date' => '2025-4-01',
                'status'        => 'submitted',
            ], // 1 submitted 1
            [
                'user_id'       => 2,
                'company_name'  => 'PT. Konstruksi Nusantara',
                'project_name'  => 'Gedung Perkantoran',
                'project_address' => 'Jl. Merdeka No. 2',
                'total_cost'    => 2000000,
                'test_submission_date' => '2025-4-02',
                'status'        => 'approved',
            ], // 2 approved 2
            [
                'user_id'       => 3,
                'company_name'  => 'PT. Bangun Sejahtera',
                'project_name'  => 'Pembangunan Rumah Sakit',
                'project_address' => 'Jl. Sehat No. 3',
                'total_cost'    => 3000000,
                'test_submission_date' => '2025-4-03',
                'status'        => 'rejected',
            ], // 3 rejected 3
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Maju Jaya',
                'project_name'  => 'Pembangunan Sekolah',
                'project_address' => 'Jl. Pendidikan No. 4',
                'total_cost'    => 4000000,
                'test_submission_date' => '2025-4-04',
                'status'        => 'submitted',
            ], // 4 submitted 1
            [
                'user_id'       => 2,
                'company_name'  => 'PT. Karya Mandiri',
                'project_name'  => 'Pembangunan Mall',
                'project_address' => 'Jl. Belanja No. 5',
                'total_cost'    => 5000000,
                'test_submission_date' => '2025-4-05',
                'status'        => 'approved',
            ], // 5 approved 2
            [
                'user_id'       => 3,
                'company_name'  => 'PT. Sukses Bersama',
                'project_name'  => 'Pembangunan Hotel',
                'project_address' => 'Jl. Wisata No. 6',
                'total_cost'    => 6000000,
                'test_submission_date' => '2025-4-06',
                'status'        => 'rejected',
            ], // 6 rejected 3
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Cipta Karya',
                'project_name'  => 'Pembangunan Apartemen',
                'project_address' => 'Jl. Hunian No. 7',
                'total_cost'    => 7000000,
                'test_submission_date' => '2025-4-07',
                'status'        => 'submitted',
            ], // 7 submitted 1
            [
                'user_id'       => 2,
                'company_name'  => 'PT. Mega Konstruksi',
                'project_name'  => 'Pembangunan Pabrik',
                'project_address' => 'Jl. Industri No. 8',
                'total_cost'    => 8000000,
                'test_submission_date' => '2025-4-08',
                'status'        => 'approved',
            ], // 8 approved 2
            [
                'user_id'       => 3,
                'company_name'  => 'PT. Prima Jaya',
                'project_name'  => 'Pembangunan Gudang',
                'project_address' => 'Jl. Logistik No. 9',
                'total_cost'    => 9000000,
                'test_submission_date' => '2025-4-09',
                'status'        => 'rejected',
            ], // 9 rejected 3
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Karya Utama',
                'project_name'  => 'Pembangunan Stadion',
                'project_address' => 'Jl. Olahraga No. 10',
                'total_cost'    => 10000000,
                'test_submission_date' => '2025-4-10',
                'status'        => 'submitted',
            ], // 10 submitted 1
            [
                'user_id'       => 2,
                'company_name'  => 'PT. Bangun Persada',
                'project_name'  => 'Pembangunan Pelabuhan',
                'project_address' => 'Jl. Laut No. 11',
                'total_cost'    => 11000000,
                'test_submission_date' => '2025-4-11',
                'status'        => 'approved',
            ], // 11 approved 2
            [
                'user_id'       => 3,
                'company_name'  => 'PT. Konstruksi Abadi',
                'project_name'  => 'Pembangunan Bandara',
                'project_address' => 'Jl. Udara No. 12',
                'total_cost'    => 12000000,
                'test_submission_date' => '2025-4-12',
                'status'        => 'rejected',
            ], // 12 rejected 3
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Maju Terus',
                'project_name'  => 'Pembangunan Jalan Tol',
                'project_address' => 'Jl. Tol No. 13',
                'total_cost'    => 13000000,
                'test_submission_date' => '2025-4-13',
                'status'        => 'submitted',
            ], // 13 submitted 1
            [
                'user_id'       => 2,
                'company_name'  => 'PT. Karya Sejahtera',
                'project_name'  => 'Pembangunan Bendungan',
                'project_address' => 'Jl. Air No. 14',
                'total_cost'    => 14000000,
                'test_submission_date' => '2025-4-14',
                'status'        => 'approved',
            ], // 14 approved 2
            [
                'user_id'       => 3,
                'company_name'  => 'PT. Sukses Makmur',
                'project_name'  => 'Pembangunan Taman',
                'project_address' => 'Jl. Hijau No. 15',
                'total_cost'    => 15000000,
                'test_submission_date' => '2025-4-15',
                'status'        => 'rejected',
            ], // 15 rejected 3
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Cipta Mandiri',
                'project_name'  => 'Pembangunan Perumahan',
                'project_address' => 'Jl. Rumah No. 16',
                'total_cost'    => 16000000,
                'test_submission_date' => '2025-4-16',
                'status'        => 'submitted',
            ], // 16 submitted 1
            [
                'user_id'       => 2,
                'company_name'  => 'PT. Mega Sejahtera',
                'project_name'  => 'Pembangunan Pasar',
                'project_address' => 'Jl. Pasar No. 17',
                'total_cost'    => 17000000,
                'test_submission_date' => '2025-4-17',
                'status'        => 'approved',
            ], // 17 approved 2
            [
                'user_id'       => 3,
                'company_name'  => 'PT. Prima Karya',
                'project_name'  => 'Pembangunan Terminal',
                'project_address' => 'Jl. Transportasi No. 18',
                'total_cost'    => 18000000,
                'test_submission_date' => '2025-4-18',
                'status'        => 'rejected',
            ], // 18 rejected 3
            [
                'user_id'       => 2,
                'company_name'  => 'PT. Karya Bersama',
                'project_name'  => 'Pembangunan Pusat Perbelanjaan',
                'project_address' => 'Jl. Belanja No. 19',
                'total_cost'    => 19000000,
                'test_submission_date' => '2025-4-19',
                'status'        => 'submitted',
            ], // 19 submitted 2
            [
                'user_id'       => 3,
                'company_name'  => 'PT. Maju Bersama',
                'project_name'  => 'Pembangunan Pusat Kebudayaan',
                'project_address' => 'Jl. Budaya No. 20',
                'total_cost'    => 20000000,
                'test_submission_date' => '2025-4-20',
                'status'        => 'approved',
            ], // 20 approved 3
            [
                'user_id'       => 3,
                'company_name'  => 'PT. Bangun Jaya',
                'project_name'  => 'Pembangunan Pabrik',
                'project_address' => 'Jl. Pabrik No. 9',
                'total_cost'    => 10000000,
                'test_submission_date' => '2025-4-10',
                'status'        => 'approved',
            ], // 21 approved 3
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Inovasi Teknologi',
                'project_name'  => 'Pembangunan Data Center',
                'project_address' => 'Jl. Teknologi No. 21',
                'total_cost'    => 21000000,
                'test_submission_date' => '2025-4-21',
                'status'        => 'approved',
            ], // 22 approved
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Solusi Bangun',
                'project_name'  => 'Pembangunan Gedung IT',
                'project_address' => 'Jl. Solusi No. 22',
                'total_cost'    => 22000000,
                'test_submission_date' => '2025-4-22',
                'status'        => 'approved',
            ], // 23 approved
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Karya Digital',
                'project_name'  => 'Pembangunan Kantor Digital',
                'project_address' => 'Jl. Digital No. 23',
                'total_cost'    => 23000000,
                'test_submission_date' => '2025-4-23',
                'status'        => 'approved',
            ], // 24 approved
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Bangun Kreatif',
                'project_name'  => 'Pembangunan Studio Kreatif',
                'project_address' => 'Jl. Kreatif No. 24',
                'total_cost'    => 24000000,
                'test_submission_date' => '2025-4-24',
                'status'        => 'approved',
            ], // 25 approved
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Inovasi Bangsa',
                'project_name'  => 'Pembangunan Pusat Inovasi',
                'project_address' => 'Jl. Inovasi No. 25',
                'total_cost'    => 25000000,
                'test_submission_date' => '2025-4-25',
                'status'        => 'approved',
            ], // 26 approved
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Teknologi Masa Depan',
                'project_name'  => 'Pembangunan Lab Riset',
                'project_address' => 'Jl. Riset No. 26',
                'total_cost'    => 26000000,
                'test_submission_date' => '2025-4-26',
                'status'        => 'approved',
            ], // 27 approved
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Solusi Masa Kini',
                'project_name'  => 'Pembangunan Gedung Solusi',
                'project_address' => 'Jl. Solusi No. 27',
                'total_cost'    => 27000000,
                'test_submission_date' => '2025-4-27',
                'status'        => 'approved',
            ], // 28 approved
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Bangun Harapan',
                'project_name'  => 'Pembangunan Pusat Harapan',
                'project_address' => 'Jl. Harapan No. 28',
                'total_cost'    => 28000000,
                'test_submission_date' => '2025-4-28',
                'status'        => 'approved',
            ], // 29 approved
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Karya Unggul',
                'project_name'  => 'Pembangunan Gedung Unggul',
                'project_address' => 'Jl. Unggul No. 29',
                'total_cost'    => 29000000,
                'test_submission_date' => '2025-4-29',
                'status'        => 'approved',
            ], // 30 approved
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Maju Bersama',
                'project_name'  => 'Pembangunan Gedung Bersama',
                'project_address' => 'Jl. Bersama No. 30',
                'total_cost'    => 30000000,
                'test_submission_date' => '2025-4-30',
                'status'        => 'approved',
            ], // 31 approved
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Bangun Mandiri',
                'project_name'  => 'Pembangunan Gedung Mandiri',
                'project_address' => 'Jl. Mandiri No. 31',
                'total_cost'    => 31000000,
                'test_submission_date' => '2025-5-01',
                'status'        => 'rejected',
            ], // 32 rejected
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Solusi Mandiri',
                'project_name'  => 'Pembangunan Gedung Solusi Mandiri',
                'project_address' => 'Jl. Solusi Mandiri No. 32',
                'total_cost'    => 32000000,
                'test_submission_date' => '2025-5-02',
                'status'        => 'rejected',
            ], // 33 rejected
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Karya Harapan',
                'project_name'  => 'Pembangunan Gedung Karya',
                'project_address' => 'Jl. Karya No. 33',
                'total_cost'    => 33000000,
                'test_submission_date' => '2025-5-03',
                'status'        => 'rejected',
            ], // 34 rejected
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Harapan Bangsa',
                'project_name'  => 'Pembangunan Gedung Harapan',
                'project_address' => 'Jl. Harapan No. 33',
                'total_cost'    => 33000000,
                'test_submission_date' => '2025-5-03',
                'status'        => 'rejected',
            ], // 35 rejected
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Teknologi Cerdas',
                'project_name'  => 'Pembangunan Gedung AI',
                'project_address' => 'Jl. Cerdas No. 34',
                'total_cost'    => 34000000,
                'test_submission_date' => '2025-5-04',
                'status'        => 'approved',
            ], // 36 approved
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Inovasi Unggul',
                'project_name'  => 'Pembangunan Pusat Inovasi',
                'project_address' => 'Jl. Unggul No. 35',
                'total_cost'    => 35000000,
                'test_submission_date' => '2025-5-05',
                'status'        => 'approved',
            ], // 37 approved
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Solusi Digital',
                'project_name'  => 'Pembangunan Data Center',
                'project_address' => 'Jl. Digital No. 36',
                'total_cost'    => 36000000,
                'test_submission_date' => '2025-5-06',
                'status'        => 'approved',
            ], // 38 approved
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Bangun Teknologi',
                'project_name'  => 'Pembangunan Gedung Teknologi',
                'project_address' => 'Jl. Teknologi No. 37',
                'total_cost'    => 37000000,
                'test_submission_date' => '2025-5-07',
                'status'        => 'approved',
            ], // 39 approved
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Karya Inovasi',
                'project_name'  => 'Pembangunan Lab Inovasi',
                'project_address' => 'Jl. Inovasi No. 38',
                'total_cost'    => 38000000,
                'test_submission_date' => '2025-5-08',
                'status'        => 'approved',
            ], // 40 approved
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Unggul Bersama',
                'project_name'  => 'Pembangunan Gedung Unggul',
                'project_address' => 'Jl. Bersama No. 39',
                'total_cost'    => 39000000,
                'test_submission_date' => '2025-5-09',
                'status'        => 'approved',
            ], // 41 approved
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Maju Digital',
                'project_name'  => 'Pembangunan Kantor Digital',
                'project_address' => 'Jl. Digital No. 40',
                'total_cost'    => 40000000,
                'test_submission_date' => '2025-5-10',
                'status'        => 'approved',
            ], // 42 approved
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Solusi Masa Depan',
                'project_name'  => 'Pembangunan Gedung Masa Depan',
                'project_address' => 'Jl. Masa Depan No. 41',
                'total_cost'    => 41000000,
                'test_submission_date' => '2025-5-11',
                'status'        => 'approved',
            ], // 43 approved
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Harapan Teknologi',
                'project_name'  => 'Pembangunan Pusat Harapan',
                'project_address' => 'Jl. Harapan No. 42',
                'total_cost'    => 42000000,
                'test_submission_date' => '2025-5-12',
                'status'        => 'approved',
            ], // 44 approved
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Karya Masa Kini',
                'project_name'  => 'Pembangunan Gedung Masa Kini',
                'project_address' => 'Jl. Masa Kini No. 43',
                'total_cost'    => 43000000,
                'test_submission_date' => '2025-5-13',
                'status'        => 'approved',
            ], // 45 approved
        ];

        $submissionTests = [
            [
                'submission_id' => 1,
                'test_id' => 1,
                'quantity' => 2,
            ],
            [
                'submission_id' => 3,
                'test_id' => 2,
                'quantity' => 1,
            ],
            [
                'submission_id' => 4,
                'test_id' => 3,
                'quantity' => 3,
            ],
            [
                'submission_id' => 6,
                'test_id' => 4,
                'quantity' => 2,
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
                'test_id' => 7,
                'quantity' => 1,
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
                'submission_id' => 28,
                'test_id'       => 4,
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

        foreach ($submissions as $submission) {
            Submission::create($submission);
        }

        foreach ($submissionPackages as $submissionPackage) {
            SubmissionPackage::create($submissionPackage);
        }

        foreach ($submissionTests as $submissionTest) {
            SubmissionTest::create($submissionTest);
        }
    }
}
