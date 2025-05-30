<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Test extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "name",
        "slug",
        "price",
        "description",
        "images",
        "minimum_unit",
        "daily_slot",
        "is_active",
        "category_id",
        "laboratory_id"
    ];

    protected $casts = [
        "is_active" => "boolean",
        "images" => "array",
    ];

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        $this->attributes['slug'] = Str::slug($value) . '-' . Str::lower(Str::random(4));
    }

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

    public function submissionTests(): HasMany
    {
        return $this->hasMany(SubmissionTest::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

}
