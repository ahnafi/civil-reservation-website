<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Package extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "name",
        "slug",
        "price",
        "images",
        "description",
        "laboratory_id"
    ];

    protected $casts = [
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


    public function tests(): BelongsToMany
    {
        return $this->belongsToMany(Test::class)->withTimestamps();
    }

    public function submissions(): BelongsToMany
    {
        return $this->belongsToMany(Submission::class)->withTimestamps();
    }

    public function submissionPackages(): HasMany
    {
        return $this->hasMany(SubmissionPackage::class);
    }

    public function laboratory(): BelongsTo
    {
        return $this->belongsTo(Laboratory::class);
    }

    public function carts(): MorphMany
    {
    return $this->morphMany(Cart::class, 'cartable');
    }
}
