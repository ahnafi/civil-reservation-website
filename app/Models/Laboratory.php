<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Laboratory extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "name",
        "room",
        "daily_slots"
    ];

    public function labSchedules(): HasMany
    {
        return $this->hasMany(LabSchedule::class);
    }

    public function testTypes(): HasMany
    {
        return $this->hasMany(TestType::class);
    }
}
