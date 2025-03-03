<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Test extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "note",
        "status"
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Documents::class);
    }

    public function labSchedules(): BelongsToMany
    {
        return $this->belongsToMany(LabSchedule::class,"test_scheduling")->withTimestamps();
    }
}
