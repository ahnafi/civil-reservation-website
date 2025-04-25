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

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($model) {
            $model->slug = Str::slug($model->name) . '-' . Str::lower(Str::random(4));
        });

        static::updating(function ($model) {
            if ($model->isDirty('name')) {
                $model->slug = Str::slug($model->name) . '-' . Str::lower(Str::random(4));
            }
        });
    }

//    public function getRouteKeyName(): string
//    {
//        return 'slug';
//    }

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

    public function carts(): MorphMany
    {
        return $this->morphMany(Cart::class, 'cartable');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

}
