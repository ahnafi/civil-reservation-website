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

            // Generate code based on the test date and submission ID
            $date = Carbon::parse($testing->test_date)->format('Ymd');
            $submissionId = str_pad($testing->submission_id ?? 0, 3, '0', STR_PAD_LEFT);
            $testingId = str_pad($testing->id ?? 0, 3, '0', STR_PAD_LEFT);

            $testing->code = 'UJI-' . $date . '-' . $submissionId . $testingId;
            $testing->saveQuietly();
        });

        static::created(function ($testing) {
            $userEmail = $testing->submission->user->email;
            Mail::to($userEmail)->send(new TestingWip($testing->id));
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
