<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Package extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "name",
        "price",
        "image",
        "description"
    ];

    public function tests(): BelongsToMany
    {
        return $this->belongsToMany(Test::class)->withTimestamps();
    }

    public function submissions(): BelongsToMany
    {
        return $this->belongsToMany(Submission::class)->withTimestamps();
    }

}
