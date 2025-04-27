<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ScheduleTesting extends Pivot
{
    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }

    public function testing(): BelongsTo
    {
        return $this->belongsTo(Testing::class);
    }
}
