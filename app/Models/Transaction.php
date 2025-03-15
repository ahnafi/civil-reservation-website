<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
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
        "payment_date",
        "submission_id",
        "note"
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($transaction) {
            $submission = $transaction->submission;
            $submissionId = $submission?->id ?? '000';
            $userId = $submission?->user_id ?? '000';
            $transactionCount = $submission ? $submission->transactions()->count() + 1 : 1;

            $transaction->code = 'TRX-' . now()->format('Ymd') . $submissionId . $userId . $transactionCount;
        });
    }

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }
}
