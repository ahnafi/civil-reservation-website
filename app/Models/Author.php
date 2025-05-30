<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Author extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'email',
        'bio',
        'avatar',
    ];

    public function news(): HasMany
    {
        return $this->hasMany(News::class);
    }
}
