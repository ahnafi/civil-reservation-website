<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class LabSchedule extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "date",
        "available_slots",
        "laboratory_id"
    ];

    public function laboratory(): BelongsTo
    {
        return $this->belongsTo(Laboratory::class);
    }

    public function tests(): BelongsToMany
    {
        return $this->belongsToMany(Test::class,"test_scheduling")->withTimestamps();
    }
}
