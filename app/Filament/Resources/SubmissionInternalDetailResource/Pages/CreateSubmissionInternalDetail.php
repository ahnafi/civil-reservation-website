<?php

namespace App\Filament\Resources\SubmissionInternalDetailResource\Pages;

use App\Filament\Resources\SubmissionInternalDetailResource;
use App\Models\Submission;
use App\Models\SubmissionInternalDetail;
use App\Models\SubmissionPackage;
use App\Models\SubmissionTest;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Database\Eloquent\Model;

class CreateSubmissionInternalDetail extends CreateRecord
{
    protected static string $resource = SubmissionInternalDetailResource::class;

    protected function handleRecordCreation(array $data): Model
    {
        // Data submission sekarang di level root
        $submissionData = [
            'user_id' => $data['user_id'] ?? null,
            'submission_type' => $data['submission_type'] ?? 'internal',
            'test_submission_date' => $data['test_submission_date'] ?? null,
            'status' => $data['status'] ?? 'submitted',
            'documents' => $data['documents'] ?? null,
            'user_note' => $data['user_note'] ?? null,
            'admin_note' => $data['admin_note'] ?? null,
            'approval_date' => $data['approval_date'] ?? null,
        ];

        $internalDetailData = [
            'name' => $data['name'],
            'program_study' => $data['program_study'],
            'research_title' => $data['research_title'],
            'personnel_count' => $data['personnel_count'] ?? 1,
            'supervisor' => $data['supervisor'] ?? null,
        ];

        // Buat internal detail terlebih dahulu
        $internalDetail = SubmissionInternalDetail::create($internalDetailData);

        // Tambahkan internal_detail_id ke submission data
        $submissionData['submission_internal_detail_id'] = $internalDetail->id;

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

        return $internalDetail;
    }
}
