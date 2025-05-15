<?php

namespace App\Services;

use Filament\Notifications\Notification;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;

class TestingService
{

    public function solved(array $data, Model $record)
    {

        $user = $record->submission->user;
        if ($user && $user->email) {

            $record->status = "completed";
            $record->completed_at = Carbon::now()->format('Y-m-d\TH:i:s');
            $record->documents = $data['documents'];
            $record->note = $data['note'] ?? null;
            $record->save();

            Mail::raw("Pengujian selesai.", function ($message) use ($user) {
                $message->to($user->email)
                    ->subject('Pengujian selesai');
            });

            Notification::make()
                ->title('Pengujian selesai')
                ->body("Pengajuan oleh {$user->name} dengan kode pengajuan {$record->submission->code} telah selesai.")
                ->success()
                ->send();
        } else {
            Notification::make()
                ->title('Gagal mengubah pengujian ')
                ->body("Pengujian dengan kode {$record->code} gagal diubah.")
                ->danger()
                ->send();
        }
    }

}