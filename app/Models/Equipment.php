<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Equipment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "name",
        "description",
        "image",
    ];

    public static function boot()
    {
        parent::boot();

        static::updating(function ($model) {
            if ($model->isDirty('image')) {
                $originalImage = $model->getOriginal('image');
                $newImage = $model->image;

                if ($originalImage && $originalImage !== $newImage && Storage::disk('public')->exists($originalImage)) {
                    Storage::disk('public')->delete($originalImage);
                }
            }
        });

        static::deleting(function ($model) {
            if (!empty($model->image) && Storage::disk('public')->exists($model->image)) {
                Storage::disk('public')->delete($model->image);
            }
        });
    }

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
