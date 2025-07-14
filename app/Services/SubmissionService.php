<?php

namespace App\Services;

use App\Mail\SubmissionApproved;
use App\Mail\SubmissionMail;
use App\Mail\SubmissionRejected;
use Filament\Notifications\Notification;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;

class SubmissionService
{

    public function accept(Model $record): void
    {
        // Eager load the submission and user relationship
        $record->load(['submission.user']);

        if ($record->submission->user && $record->submission->user->email) {
            $record->submission->status = 'approved';
            $record->submission->approval_date = Carbon::now()->format('Y-m-d\TH:i:s');
            $record->submission->save();

            Mail::to($record->submission->user->email)->send(new SubmissionApproved($record->submission->id));

            Notification::make()
                ->title('Pengajuan berhasil disetujui')
                ->body("Pengajuan oleh {$record->submission->user->name} telah disetujui.")
                ->success()
                ->send();
        } else {
            Notification::make()
                ->title('Gagal mengubah pengajuan ')
                ->body("Pengajuan gagal diubah karena data pengguna tidak lengkap.")
                ->danger()
                ->send();
        }
    }

    public function reject(array $data, Model $record)
    {
        // Eager load the submission and user relationship
        $record->load(['submission.user']);

        if ($record->submission->user && $record->submission->user->email) {
            $record->submission->status = 'rejected';
            $record->submission->save();

            Mail::to($record->submission->user->email)->send(new SubmissionRejected($record->submission->id, $data["reason"]));

            Notification::make()
                ->title('Pengajuan Ditolak')
                ->body("Pengajuan oleh {$record->submission->user->name} telah ditolak.")
                ->success()
                ->send();
        } else {
            Notification::make()
                ->title('Gagal mengubah pengajuan ')
                ->body("Pengajuan gagal diubah karena data pengguna tidak lengkap.")
                ->danger()
                ->send();
        }
    }
}
