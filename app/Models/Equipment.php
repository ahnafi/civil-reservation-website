<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Equipment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "name",
        "description",
        "image",
    ];

    public function laboratories(): BelongsToMany
    {
        return $this->belongsToMany(
            Laboratory::class,
            'equipment_laboratory',
            'equipment_id',
            'laboratory_id'
        );
    }
}
