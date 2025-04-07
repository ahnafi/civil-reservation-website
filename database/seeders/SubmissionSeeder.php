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
                'test_submission_date' => '2023-10-01',
                'status'        => 'submitted',
            ],
            [
                'user_id'       => 2,
                'company_name'  => 'PT. Konstruksi Nusantara',
                'project_name'  => 'Gedung Perkantoran',
                'project_address' => 'Jl. Merdeka No. 2',
                'total_cost'    => 2000000,
                'test_submission_date' => '2023-10-02',
                'status'        => 'approved',
            ],
            [
                'user_id'       => 3,
                'company_name'  => 'PT. Bangun Sejahtera',
                'project_name'  => 'Pembangunan Rumah Sakit',
                'project_address' => 'Jl. Sehat No. 3',
                'total_cost'    => 3000000,
                'test_submission_date' => '2023-10-03',
                'status'        => 'rejected',
            ],
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Maju Jaya',
                'project_name'  => 'Pembangunan Sekolah',
                'project_address' => 'Jl. Pendidikan No. 4',
                'total_cost'    => 4000000,
                'test_submission_date' => '2023-10-04',
                'status'        => 'submitted',
            ],
            [
                'user_id'       => 2,
                'company_name'  => 'PT. Karya Mandiri',
                'project_name'  => 'Pembangunan Mall',
                'project_address' => 'Jl. Belanja No. 5',
                'total_cost'    => 5000000,
                'test_submission_date' => '2023-10-05',
                'status'        => 'approved',
            ],
            [
                'user_id'       => 3,
                'company_name'  => 'PT. Sukses Bersama',
                'project_name'  => 'Pembangunan Hotel',
                'project_address' => 'Jl. Wisata No. 6',
                'total_cost'    => 6000000,
                'test_submission_date' => '2023-10-06',
                'status'        => 'rejected',
            ],
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Cipta Karya',
                'project_name'  => 'Pembangunan Apartemen',
                'project_address' => 'Jl. Hunian No. 7',
                'total_cost'    => 7000000,
                'test_submission_date' => '2023-10-07',
                'status'        => 'submitted',
            ],
            [
                'user_id'       => 2,
                'company_name'  => 'PT. Mega Konstruksi',
                'project_name'  => 'Pembangunan Pabrik',
                'project_address' => 'Jl. Industri No. 8',
                'total_cost'    => 8000000,
                'test_submission_date' => '2023-10-08',
                'status'        => 'approved',
            ],
            [
                'user_id'       => 3,
                'company_name'  => 'PT. Prima Jaya',
                'project_name'  => 'Pembangunan Gudang',
                'project_address' => 'Jl. Logistik No. 9',
                'total_cost'    => 9000000,
                'test_submission_date' => '2023-10-09',
                'status'        => 'rejected',
            ],
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Karya Utama',
                'project_name'  => 'Pembangunan Stadion',
                'project_address' => 'Jl. Olahraga No. 10',
                'total_cost'    => 10000000,
                'test_submission_date' => '2023-10-10',
                'status'        => 'submitted',
            ],
            [
                'user_id'       => 2,
                'company_name'  => 'PT. Bangun Persada',
                'project_name'  => 'Pembangunan Pelabuhan',
                'project_address' => 'Jl. Laut No. 11',
                'total_cost'    => 11000000,
                'test_submission_date' => '2023-10-11',
                'status'        => 'approved',
            ],
            [
                'user_id'       => 3,
                'company_name'  => 'PT. Konstruksi Abadi',
                'project_name'  => 'Pembangunan Bandara',
                'project_address' => 'Jl. Udara No. 12',
                'total_cost'    => 12000000,
                'test_submission_date' => '2023-10-12',
                'status'        => 'rejected',
            ],
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Maju Terus',
                'project_name'  => 'Pembangunan Jalan Tol',
                'project_address' => 'Jl. Tol No. 13',
                'total_cost'    => 13000000,
                'test_submission_date' => '2023-10-13',
                'status'        => 'submitted',
            ],
            [
                'user_id'       => 2,
                'company_name'  => 'PT. Karya Sejahtera',
                'project_name'  => 'Pembangunan Bendungan',
                'project_address' => 'Jl. Air No. 14',
                'total_cost'    => 14000000,
                'test_submission_date' => '2023-10-14',
                'status'        => 'approved',
            ],
            [
                'user_id'       => 3,
                'company_name'  => 'PT. Sukses Makmur',
                'project_name'  => 'Pembangunan Taman',
                'project_address' => 'Jl. Hijau No. 15',
                'total_cost'    => 15000000,
                'test_submission_date' => '2023-10-15',
                'status'        => 'rejected',
            ],
            [
                'user_id'       => 1,
                'company_name'  => 'PT. Cipta Mandiri',
                'project_name'  => 'Pembangunan Perumahan',
                'project_address' => 'Jl. Rumah No. 16',
                'total_cost'    => 16000000,
                'test_submission_date' => '2023-10-16',
                'status'        => 'submitted',
            ],
            [
                'user_id'       => 2,
                'company_name'  => 'PT. Mega Sejahtera',
                'project_name'  => 'Pembangunan Pasar',
                'project_address' => 'Jl. Pasar No. 17',
                'total_cost'    => 17000000,
                'test_submission_date' => '2023-10-17',
                'status'        => 'approved',
            ],
            [
                'user_id'       => 3,
                'company_name'  => 'PT. Prima Karya',
                'project_name'  => 'Pembangunan Terminal',
                'project_address' => 'Jl. Transportasi No. 18',
                'total_cost'    => 18000000,
                'test_submission_date' => '2023-10-18',
                'status'        => 'rejected',
            ],
            [
                'user_id'       => 2,
                'company_name'  => 'PT. Karya Bersama',
                'project_name'  => 'Pembangunan Pusat Perbelanjaan',
                'project_address' => 'Jl. Belanja No. 19',
                'total_cost'    => 19000000,
                'test_submission_date' => '2023-10-19',
                'status'        => 'submitted',
            ],
            [
                'user_id'       => 3,
                'company_name'  => 'PT. Maju Bersama',
                'project_name'  => 'Pembangunan Pusat Kebudayaan',
                'project_address' => 'Jl. Budaya No. 20',
                'total_cost'    => 20000000,
                'test_submission_date' => '2023-10-20',
                'status'        => 'approved',
            ],
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
