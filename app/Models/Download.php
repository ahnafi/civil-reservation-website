<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Download extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "title",
        "description",
        "file",
    ];

    public static function boot()
    {
        parent::boot();

        static::updating(function ($model) {
            if ($model->isDirty('file')) {
                $originalFile = $model->getOriginal('file');
                $newFile = $model->file;

                if ($originalFile && $originalFile !== $newFile && Storage::disk('public')->exists($originalFile)) {
                    Storage::disk('public')->delete($originalFile);
                }
            }
        });

        static::deleting(function ($model) {
            if (!empty($model->file) && Storage::disk('public')->exists($model->file)) {
                Storage::disk('public')->delete($model->file);
            }
        });
    }
}
