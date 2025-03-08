<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Testing extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "status",
        "note",
        "test_date",
        "completed_at",
        "submission_id"
    ];

    public function schedules(): BelongsToMany
    {
        return $this->belongsToMany(Schedule::class)->withTimestamps();
    }

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    public function documents(): HasOne
    {
        return $this->hasOne(Document::class);
    }
}
