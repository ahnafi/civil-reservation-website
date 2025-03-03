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
        "test_id"
    ];

    public function test(): BelongsTo
    {
        return $this->belongsTo(Test::class);
    }
}
