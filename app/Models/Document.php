<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "name",
        "path",
        "testing_id"
    ];

    public function testing(): BelongsTo
    {
        return $this->belongsTo(Testing::class);
    }
}
