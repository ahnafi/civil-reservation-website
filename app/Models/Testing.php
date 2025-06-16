<?php

namespace App\Models;

use App\Mail\TestingWip;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Services\BookingService;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Testing extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "code",
        "status",
        "note",
        "test_date",
        "completed_at",
        "documents",
        "submission_id"
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::created(function ($testing) {
            // Create ScheduleTesting record
            $bookingService = new BookingService();
            $bookingService->storeScheduleTesting($testing->id);

            $submission = $testing->submission;

            // Generate code based on the test date and submission Code
            $date = Carbon::parse($testing->test_date)->format('Ymd');
            $submissionCode = $submission->code;

            $testing->code = 'UJI-' . $submissionCode . '-' . $date;
            $testing->saveQuietly();
//             send mail
            $userEmail = $testing->submission->user->email;
            Mail::to($userEmail)->send(new TestingWip($testing->id));
        });

        static::updating(function ($model) {
              if ($model->isDirty('documents')) {
                $originalDocuments = $model->getOriginal('documents') ?? [];
                $newDocuments = $model->documents ?? [];

                $removedDocuments = array_diff($originalDocuments, $newDocuments);

                foreach ($removedDocuments as $removedDocument) {
                    if (Storage::disk('public')->exists($removedDocument)) {
                        Storage::disk('public')->delete($removedDocument);
                    }
                }
             }
        });

        static::deleting(function ($model) {
            if (!empty($model->documents)) {
                foreach ($model->documents as $filename) {
                    if (Storage::disk('public')->exists($filename)) {
                        Storage::disk('public')->delete($filename);
                    }
                }
            }
        });

    }

    protected $casts = [
        "documents" => "array",
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    public function reviews(): HasOne
    {
        return $this->hasOne(Reviews::class);
    }

    public function schedules(): BelongsToMany
    {
        return $this->belongsToMany(Schedule::class)->withTimestamps();
    }
}
