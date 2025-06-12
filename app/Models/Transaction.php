<?php

namespace App\Models;

use App\Mail\TransactionPending;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class Transaction extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "code",
        "payment_invoice_file",
        "payment_receipt_image",
        "amount",
        "payment_method",
        "status",
        "payment_deadline",
        "payment_date",
        "submission_id",
        "note"
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($transaction) {

            // Generate a unique code for the transaction
            $submission = $transaction->submission;
            $submissionId = $submission?->id ?? '000';
            $userId = $submission?->user_id ?? '000';
            $transactionCount = $submission ? $submission->transactions()->withTrashed()->count() + 1 : 1;
            $transaction->code = 'CVL-' . now()->format('Ymd') . $submissionId . $userId . $transactionCount;

            // Set the payment deadline to 1 day from now
            if (is_null($transaction->payment_deadline)) {
                $transaction->payment_deadline = now()->addDay();
            }
        });

        static::created(function ($transaction) {
            $userEmail = $transaction->submission->user->email;
            Mail::to($userEmail)->send(new TransactionPending($transaction->id));
        });
    }

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }
}
