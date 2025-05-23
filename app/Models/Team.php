<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Team extends Model
{

    use SoftDeletes;

    protected $fillable = [
        "name",
        "photo",
        "position_id",
    ];

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }
}
