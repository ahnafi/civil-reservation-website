<?php

namespace App\Mail;

use App\Models\Submission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubmissionSubmitted extends Mailable
{
    use Queueable, SerializesModels;

    protected Submission $submission;

    /**
     * Create a new message instance.
     */
    public function __construct(int $submissionId)
    {
        // Load submission dengan relasi yang dibutuhkan
        $this->submission = Submission::with(['user', 'tests', 'packages'])->findOrFail($submissionId);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "[{$this->submission->code}] Pengajuan Baru Menunggu Review",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.submission.submitted',
            with: [
                'submission' => $this->submission,
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
