<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Laboratory extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "code",
        "name",
        "room"
    ];

    public function tests(): HasMany
    {
        return $this->hasMany(Test::class);
    }

    public function packages(): HasMany
    {
        return $this->hasMany(Package::class);
    }
}
