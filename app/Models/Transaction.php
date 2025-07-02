<?php

namespace App\Models;

use App\Mail\TransactionPending;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Transaction extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "code",
        "payment_invoice_files",
        "payment_receipt_images",
        "amount",
        "payment_method",
        "status",
        "payment_deadline",
        "payment_date",
        "submission_id",
        "note"
    ];

    protected $casts = [
        "payment_invoice_files" => "array",
        "payment_receipt_images" => "array",
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($transaction) {

            // Generate a unique code for the transaction
            $submission = $transaction->submission;
            $submissionCode = $submission?->code ?? '000';
            $userId = $submission?->user_id ?? '000';

            $uuid = Str::uuid()->toString();
            $shortUuid = substr(str_replace('-', '', $uuid), 0, 6);

            $transaction->code = 'CVL-U' . $userId . '-' . $submissionCode . '-' . $shortUuid . '-' . now()->format('Ymd');

            if (is_null($transaction->payment_deadline)) {
                $transaction->payment_deadline = now()->addDay();
            }
        });


        static::created(function ($transaction) {
            $userEmail = $transaction->submission->user->email;
            Mail::to($userEmail)->send(new TransactionPending($transaction->id));
        });

        static::updating(function ($transaction) {
            if ($transaction->isDirty('payment_invoice_files')) {
                $original = $transaction->getOriginal('payment_invoice_files') ?? [];
                $new = $transaction->payment_invoice_files ?? [];

                $originalFiles = is_array($original) ? $original : [$original];
                $newFiles = is_array($new) ? $new : [$new];

                $removedFiles = array_diff($originalFiles, $newFiles);

                foreach ($removedFiles as $file) {
                    if (Storage::disk('public')->exists($file)) {
                        Storage::disk('public')->delete($file);
                    }
                }
            }

            if ($transaction->isDirty('payment_receipt_images')) {
                $original = $transaction->getOriginal('payment_receipt_images') ?? [];
                $new = $transaction->payment_receipt_images ?? [];

                $originalFiles = is_array($original) ? $original : [$original];
                $newFiles = is_array($new) ? $new : [$new];

                $removedFiles = array_diff($originalFiles, $newFiles);

                foreach ($removedFiles as $file) {
                    if (Storage::disk('public')->exists($file)) {
                        Storage::disk('public')->delete($file);
                    }
                }
            }
        });

        static::deleting(function ($transaction) {
            $invoiceFiles = $transaction->payment_invoice_files ?? [];
            $invoiceFiles = is_array($invoiceFiles) ? $invoiceFiles : [$invoiceFiles];

            foreach ($invoiceFiles as $file) {
                if (Storage::disk('public')->exists($file)) {
                    Storage::disk('public')->delete($file);
                }
            }

            $receiptFiles = $transaction->payment_receipt_images ?? [];
            $receiptFiles = is_array($receiptFiles) ? $receiptFiles : [$receiptFiles];

            foreach ($receiptFiles as $file) {
                if (Storage::disk('public')->exists($file)) {
                    Storage::disk('public')->delete($file);
                }
            }
        });
    }

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

}
