<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
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

            if (is_null($transaction->payment_deadline)) {
                $transaction->payment_deadline = now()->addDay();
            }
        });

        static::updating(function ($transaction) {
            if ($transaction->isDirty('payment_invoice_file')) {
                $originalInvoice = $transaction->getOriginal('payment_invoice_file');
                $newInvoice = $transaction->payment_invoice_file;

                if ($originalInvoice && $originalInvoice !== $newInvoice && Storage::disk('public')->exists($originalInvoice)) {
                    Storage::disk('public')->delete($originalInvoice);
                }
            }

            if ($transaction->isDirty('payment_receipt_image')) {
                $originalReceipt = $transaction->getOriginal('payment_receipt_image');
                $newReceipt = $transaction->payment_receipt_image;

                if ($originalReceipt && $originalReceipt !== $newReceipt && Storage::disk('public')->exists($originalReceipt)) {
                    Storage::disk('public')->delete($originalReceipt);
                }
            }
        });

        static::deleting(function ($transaction) {
            if (!empty($transaction->payment_invoice_file) && Storage::disk('public')->exists($transaction->payment_invoice_file)) {
                Storage::disk('public')->delete($transaction->payment_invoice_file);
            }

            if (!empty($transaction->payment_receipt_image) && Storage::disk('public')->exists($transaction->payment_receipt_image)) {
                Storage::disk('public')->delete($transaction->payment_receipt_image);
            }
        });

    }

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }
}
