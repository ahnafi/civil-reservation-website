<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Test extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "name",
        "price",
        "description",
        "image",
        "minimum_unit",
        "daily_slot",
        "is_active",
        "category_id",
        "laboratory_id"
    ];

    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(Package::class)->withTimestamps();
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
    
    public function laboratory(): BelongsTo
    {
        return $this->belongsTo(Laboratory::class);
    }
    
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

}
