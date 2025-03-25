<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Submission;

class SubmissionSubmitted extends Notification implements ShouldQueue
{
    use Queueable;

    public Submission $submission;

    /**
     * Create a new notification instance.
     */
    public function __construct(Submission $submission)
    {
        $this->submission = $submission->load(['tests', 'packages', "user"]);
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $mail = (new MailMessage)
            ->subject("🆕 Submission Baru: {$this->submission->project_name}")
            ->greeting("Halo {$notifiable->name},");

        // Untuk admin: Tampilkan info user pembuat
        if ($notifiable->isAdmin()) {
            $mail->line("**Pembuat Submission:**")
                ->line("- Nama: {$this->submission->user->name}")
                ->line("- Email: {$this->submission->user->email}")
                ->line("\n");
        }

        // Detail utama
        $mail->line("**Detail Submission**")
            ->line("- Perusahaan: {$this->submission->company_name}")
            ->line("- Proyek: {$this->submission->project_name}")
            ->line("- Lokasi: {$this->submission->project_address}")
            ->line("- Total Biaya: Rp " . number_format($this->submission->total_cost, 0, ',', '.'))
            ->line("- Catatan: " . ($this->submission->note ?: '-'));

        // Daftar paket
        if ($this->submission->packages->isNotEmpty()) {
            $mail->line("\n**Paket Terpilih:**");
            foreach ($this->submission->packages as $package) {
                $mail->line("- {$package->name}");
            }
        }

        // Daftar tes
        if ($this->submission->tests->isNotEmpty()) {
            $mail->line("\n**Tes yang Diminta:**");
            foreach ($this->submission->tests as $test) {
                $mail->line("- {$test->name} (Quantity: {$test->pivot->quantity})");
            }
        }

        return $mail
            ->salutation('Terima kasih telah menggunakan layanan kami!');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'submission_id' => $this->submission->id,
            'project_name' => $this->submission->project_name
        ];
    }
}
