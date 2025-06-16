<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Author extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'email',
        'bio',
        'avatar',
    ];

    public static function boot()
    {
        parent::boot();

        static::updating(function ($model) {
            if ($model->isDirty('avatar')) {
                $originalAvatar = $model->getOriginal('avatar');
                $newAvatar = $model->avatar;

                if ($originalAvatar && $originalAvatar !== $newAvatar && Storage::disk('public')->exists($originalAvatar)) {
                    Storage::disk('public')->delete($originalAvatar);
                }
            }
        });

        static::deleting(function ($model) {
            if (!empty($model->avatar) && Storage::disk('public')->exists($model->avatar)) {
                Storage::disk('public')->delete($model->avatar);
            }
        });
    }

    public function news(): HasMany
    {
        return $this->hasMany(News::class);
    }
}
