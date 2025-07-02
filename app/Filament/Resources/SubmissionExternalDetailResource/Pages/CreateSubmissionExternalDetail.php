<?php

namespace App\Filament\Resources\SubmissionExternalDetailResource\Pages;

use App\Filament\Resources\SubmissionExternalDetailResource;
use App\Models\Submission;
use App\Models\SubmissionExternalDetail;
use App\Models\SubmissionPackage;
use App\Models\SubmissionTest;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Database\Eloquent\Model;

class CreateSubmissionExternalDetail extends CreateRecord
{
    protected static string $resource = SubmissionExternalDetailResource::class;

    protected function handleRecordCreation(array $data): Model
    {
        // Data submission sekarang di level root
        $submissionData = [
            'user_id' => $data['user_id'] ?? null,
            'submission_type' => $data['submission_type'] ?? 'external',
            'test_submission_date' => $data['test_submission_date'] ?? null,
            'status' => $data['status'] ?? 'submitted',
            'documents' => $data['documents'] ?? null,
            'user_note' => $data['user_note'] ?? null,
            'admin_note' => $data['admin_note'] ?? null,
            'approval_date' => $data['approval_date'] ?? null,
        ];

        $externalDetailData = [
            'company_name' => $data['company_name'] ?? null,
            'project_name' => $data['project_name'],
            'project_address' => $data['project_address'],
            'total_cost' => $data['total_cost'] ?? 0,
        ];

        // Buat external detail terlebih dahulu
        $externalDetail = SubmissionExternalDetail::create($externalDetailData);

        // Tambahkan submission_external_detail_id ke submission data
        $submissionData['submission_external_detail_id'] = $externalDetail->id;

        // Buat submission
        $submission = Submission::create($submissionData);

        // Simpan submission packages jika ada
        if (isset($data['submissionPackages']) && is_array($data['submissionPackages'])) {
            foreach ($data['submissionPackages'] as $packageData) {
                if (isset($packageData['package_id'])) {
                    $submission->submissionPackages()->create([
                        'package_id' => $packageData['package_id']
                    ]);
                }
            }
        }

        // Simpan submission tests jika ada
        if (isset($data['submissionTests']) && is_array($data['submissionTests'])) {
            foreach ($data['submissionTests'] as $testData) {
                if (isset($testData['test_id']) && isset($testData['quantity'])) {
                    $submission->submissionTests()->create([
                        'test_id' => $testData['test_id'],
                        'quantity' => $testData['quantity']
                    ]);
                }
            }
        }

        return $externalDetail;
    }
}
