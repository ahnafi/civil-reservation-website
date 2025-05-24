<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Laboratory extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "code",
        "name",
        "slug",
        "room",
        "description",
        "image",
    ];

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        $this->attributes['slug'] = Str::slug($value);
    }

    public function tests(): HasMany
    {
        return $this->hasMany(Test::class);
    }

    public function packages(): HasMany
    {
        return $this->hasMany(Package::class);
    }

    public function equipments(): BelongsToMany
    {
        return $this->belongsToMany(
            Equipment::class,
            'equipment_laboratory', 
            'laboratory_id',       
            'equipment_id'         
        );
    }
}
