<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
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
        "images",
    ];

    protected $casts = [
        "images" => "array",
    ];

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        $this->attributes['slug'] = Str::slug($value);
    }

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
