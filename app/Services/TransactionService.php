<?php

namespace App\Services;

use Filament\Notifications\Notification;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;

class TransactionService
{
    public function accept(Model $record): void
    {
        $user = $record->submission->user;

        if ($record->payment_method == null) {
            Notification::make()
                ->title('Gagal mengubah transaksi')
                ->body("Transaksi gagal dirubah karena metode pembayaran tidak diisi.")
                ->danger()
                ->send();
            return;
        }

        if ($user && $user->email) {
            $record->status = 'success';
            $record->payment_date = Carbon::now()->format('Y-m-d\TH:i:s');
            $record->save();

            Mail::raw("Pembayaran Anda telah disetujui dengan kode pembayaran {$record->code}.", function ($message) use ($user) {
                $message->to($user->email)
                    ->subject('Pembayaran Disetujui');
            });

            Notification::make()
                ->title('Pengajuan berhasil disetujui')
                ->body("Pengajuan oleh {$user->name} telah disetujui.")
                ->success()
                ->send();
        } else {
            Notification::make()
                ->title('Gagal mengubah transaksi')
                ->body("Transaksi gagal karena data pengguna tidak lengkap.")
                ->danger()
                ->send();
        }
    }

    public function reject(array $data, Model $record): void
    {
        $user = $record->submission->user;

        if ($user && $user->email) {
            $record->status = 'failed';
            $record->note = $data['note']; // ambil dari input form
            $record->save();

            Mail::raw("Pembayaran Anda telah ditolak dengan kode pembayaran {$record->code}.", function ($message) use ($user) {
                $message->to($user->email)
                    ->subject('Pembayaran Ditolak');
            });

            Notification::make()
                ->title('Transaksi ditolak')
                ->body("Transaksi oleh {$user->name} telah ditolak.")
                ->success()
                ->send();
        } else {
            Notification::make()
                ->title('Gagal mengubah transaksi')
                ->body("Transaksi gagal diubah karena data pengguna tidak lengkap.")
                ->danger()
                ->send();
        }

    }
}
