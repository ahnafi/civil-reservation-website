<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Standard extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'nama',
        'deskripsi',
        'foto',
        'file',
    ];

    public static function boot()
    {
        parent::boot();

        static::updating(function ($model) {
            // Handle foto changes
            if ($model->isDirty('foto')) {
                $originalFoto = $model->getOriginal('foto');
                $newFoto = $model->foto;

                if ($originalFoto && $originalFoto !== $newFoto && Storage::disk('public')->exists($originalFoto)) {
                    Storage::disk('public')->delete($originalFoto);
                }
            }

            // Handle file changes
            if ($model->isDirty('file')) {
                $originalFile = $model->getOriginal('file');
                $newFile = $model->file;

                if ($originalFile && $originalFile !== $newFile && Storage::disk('public')->exists($originalFile)) {
                    Storage::disk('public')->delete($originalFile);
                }
            }
        });

        static::deleting(function ($model) {
            if (!empty($model->foto) && Storage::disk('public')->exists($model->foto)) {
                Storage::disk('public')->delete($model->foto);
            }

            if (!empty($model->file) && Storage::disk('public')->exists($model->file)) {
                Storage::disk('public')->delete($model->file);
            }
        });
    }
}
