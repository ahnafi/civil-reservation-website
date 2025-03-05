<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class UnitCategory extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "name", "description"
    ];

    public function testType(): HasMany
    {
        return $this->hasMany(TestType::class);
    }
}
