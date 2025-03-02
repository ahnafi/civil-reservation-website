<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class TestType extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "name",
        "price",
        "description",
        "image"
    ];

    public function testPackages(): BelongsToMany
    {
        return $this->belongsToMany(TestPackage::class)->withTimestamps()->withPivot('deleted_at');
    }

    public function submissions(): BelongsToMany
    {
        return $this->belongsToMany(Submission::class)->withTimestamps()->withPivot("deleted_at");
    }
}
