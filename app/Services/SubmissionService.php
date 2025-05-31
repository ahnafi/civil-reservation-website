<?php

namespace App\Services;

use Filament\Notifications\Notification;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;

class SubmissionService
{

    public function accept(Model $record): void
    {
        if ($record->user && $record->user->email) {
            $record->status = 'approved';
            $record->approval_date = Carbon::now()->format('Y-m-d\TH:i:s');
            $record->save();

            Mail::raw('Pengajuan Anda telah disetujui.', function ($message) use ($record) {
                $message->to($record->user->email)
                    ->subject('Pengajuan Disetujui');
            });

            Notification::make()
                ->title('Pengajuan berhasil disetujui')
                ->body("Pengajuan oleh {$record->user->name} telah disetujui.")
                ->success()
                ->send();
        } else {
            Notification::make()
                ->title('Gagal mengubah pengajuan ')
                ->body("Pengajuan oleh {$record->user->name} gagal diubah.")
                ->danger()
                ->send();
        }
    }

    public function reject(array $data, Model $record)
    {
        if ($record->user && $record->user->email) {

            $record->status = 'rejected';
            $record->save();

            Mail::raw("Pengajuan Anda ditolak." . $data["reason"], function ($message) use ($record) {
                $message->to($record->user->email)
                    ->subject('Pengajuan Ditolak');
            });

            Notification::make()
                ->title('Pengajuan Ditolak')
                ->body("Pengajuan oleh {$record->user->name} telah ditolak.")
                ->success()
                ->send();
        } else {
            Notification::make()
                ->title('Gagal mengubah pengajuan ')
                ->body("Pengajuan oleh {$record->user->name} gagal diubah.")
                ->danger()
                ->send();
        }
    }

}