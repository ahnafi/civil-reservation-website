<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Schedule extends Model
{
    protected $fillable = [
        "date",
        "available_slots",
        "test_id"
    ];

    public function test(): BelongsTo
    {
        return $this->belongsTo(Test::class);
    }

    public function testings(): BelongsToMany
    {
        return $this->belongsToMany(Testing::class)->withTimestamps();
    }

    // Helper accessor untuk menghitung slot yang terpakai
    public function getUsedSlotsAttribute()
    {
        return optional($this->test)->daily_slot - $this->available_slots;
    }
}
