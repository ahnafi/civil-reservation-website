<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reviews extends Model
{
    use softDeletes;

    protected $fillable = [
        'rating',
        'content',
        'testing_id',
    ];

    public function testing(): BelongsTo
    {
        return $this->belongsTo(Testing::class);
    }
}
