<?php

namespace App\Mail;

use App\Models\Submission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubmissionRejected extends Mailable
{
    use Queueable, SerializesModels;

    protected Submission $submission;
    protected ?string $reason = null;

    /**
     * Create a new message instance.
     */
    public function __construct(int $submissionId, string $reason = null)
    {
        // Load submission dengan relasi yang dibutuhkan
        $this->submission = Submission::with(['user', 'tests', 'packages'])->findOrFail($submissionId);
        $this->reason = $reason;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "[{$this->submission->code}] Pengajuan Anda Ditolak – Berikut Penjelasannya",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.submission.rejected',
            with: [
                'submission' => $this->submission,
                "reason" => $this->reason
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
