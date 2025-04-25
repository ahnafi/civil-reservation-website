<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'cartable_id',
        'cartable_type',
        'quantity',
        'price',
    ];

    public function cartable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
