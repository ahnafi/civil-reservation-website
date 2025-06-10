<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
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

    public static function boot()
    {
        parent::boot();

        static::updating(function ($model) {
            if ($model->isDirty('name')) {
                $model->slug = Str::slug($model->name, '-');
            }

            if ($model->isDirty('images')) {
                $originalImages = $model->getOriginal('images') ?? [];
                $newImages = $model->images ?? [];

                $removedImages = array_diff($originalImages, $newImages);

                foreach ($removedImages as $removedImage) {
                    if (Storage::disk('public')->exists($removedImage)) {
                        Storage::disk('public')->delete($removedImage);
                    }
                }
            }
        });

        static::deleting(function ($model) {
            if (!empty($model->images)) {
                foreach ($model->images as $filename) {
                    if (Storage::disk('public')->exists($filename)) {
                        Storage::disk('public')->delete($filename);
                    }
                }
            }
        });
    }

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        $this->attributes['slug'] = Str::slug($value) . '-' . Str::lower(Str::random(4));
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

}
