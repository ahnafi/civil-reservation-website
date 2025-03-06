<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Test extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "name", "price", "description", "image", "minimum_unit", "daily_slot", "is_active", "category_id", "laboratory_id"
    ];
}
