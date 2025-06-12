<?php

namespace App\Mail;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TransactionPending extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected Transaction $transaction;

    /**
     * Create a new message instance.
     */
    public function __construct(int $transactionId)
    {
        // Load transaction dengan relasi yang dibutuhkan
        $this->transaction = Transaction::with([
            'submission.user', 
            'submission.tests', 
            'submission.packages'
        ])->findOrFail($transactionId);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "[{$this->transaction->code}] Lanjutkan Pembayaran Anda",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.transaction.pending',
            with: [
                'transaction' => $this->transaction
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