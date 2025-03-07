<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Schedule extends Model
{
    use SoftDeletes;

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
}
