<?php

namespace App\Filament\Resources\SubmissionInternalDetailResource\Pages;

use App\Filament\Resources\SubmissionInternalDetailResource;
use App\Models\Submission;
use App\Models\SubmissionPackage;
use App\Models\SubmissionTest;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;

class EditSubmissionInternalDetail extends EditRecord
{
    protected static string $resource = SubmissionInternalDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
            Actions\ForceDeleteAction::make(),
            Actions\RestoreAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        // Load submission data untuk form
        $submission = Submission::where('submission_internal_detail_id', $this->record->id)->first();
        
        if ($submission) {
            // Masukkan data submission langsung ke level root
            $data['user_id'] = $submission->user_id;
            $data['submission_type'] = $submission->submission_type;
            $data['test_submission_date'] = $submission->test_submission_date;
            $data['status'] = $submission->status;
            $data['documents'] = $submission->documents;
            $data['user_note'] = $submission->user_note;
            $data['admin_note'] = $submission->admin_note;
            $data['approval_date'] = $submission->approval_date;

            // Load submission packages
            $data['submissionPackages'] = $submission->submissionPackages()
                ->get()
                ->map(function ($submissionPackage) {
                    return [
                        'package_id' => $submissionPackage->package_id,
                    ];
                })
                ->toArray();

            // Load submission tests
            $data['submissionTests'] = $submission->submissionTests()
                ->get()
                ->map(function ($submissionTest) {
                    return [
                        'test_id' => $submissionTest->test_id,
                        'quantity' => $submissionTest->quantity,
                    ];
                })
                ->toArray();
        }

        return $data;
    }

    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        // Update internal detail
        $internalDetailData = [
            'name' => $data['name'],
            'program_study' => $data['program_study'],
            'research_title' => $data['research_title'],
            'personnel_count' => $data['personnel_count'] ?? 1,
            'supervisor' => $data['supervisor'] ?? null,
        ];

        $record->update($internalDetailData);

        // Update submission data
        $submissionData = [
            'user_id' => $data['user_id'],
            'submission_type' => $data['submission_type'] ?? 'internal',
            'test_submission_date' => $data['test_submission_date'],
            'status' => $data['status'] ?? 'submitted',
            'documents' => $data['documents'] ?? null,
            'user_note' => $data['user_note'] ?? null,
            'admin_note' => $data['admin_note'] ?? null,
            'approval_date' => $data['approval_date'] ?? null,
        ];

        $submission = Submission::where('submission_internal_detail_id', $record->id)->first();
        if ($submission) {
            $submission->update($submissionData);

            // Update submission packages
            $submission->submissionPackages()->delete(); // Hapus yang lama
            if (isset($data['submissionPackages']) && is_array($data['submissionPackages'])) {
                foreach ($data['submissionPackages'] as $packageData) {
                    if (isset($packageData['package_id'])) {
                        $submission->submissionPackages()->create([
                            'package_id' => $packageData['package_id']
                        ]);
                    }
                }
            }

            // Update submission tests
            $submission->submissionTests()->delete(); // Hapus yang lama
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
        }

        return $record;
    }
}
