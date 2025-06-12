<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Team extends Model
{

    use SoftDeletes;

    protected $fillable = [
        "name",
        "photo",
        "position_id",
    ];

    public static function boot()
    {
        parent::boot();

        static::updating(function ($model) {
            if ($model->isDirty('photo')) {
                $originalPhoto = $model->getOriginal('photo');
                $newPhoto = $model->photo;

                if ($originalPhoto && $originalPhoto !== $newPhoto && Storage::disk('public')->exists($originalPhoto)) {
                    Storage::disk('public')->delete($originalPhoto);
                }
            }
        });

        static::deleting(function ($model) {
            if (!empty($model->photo) && Storage::disk('public')->exists($model->photo)) {
                Storage::disk('public')->delete($model->photo);
            }
        });
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }
}
