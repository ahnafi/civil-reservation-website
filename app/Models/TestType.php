<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class TestType extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "name",
        "price",
        "description",
        "image",
        "minimum_unit",
        "unit_category_id",
        "laboratory_id"
    ];

    public function testPackages(): BelongsToMany
    {
        return $this->belongsToMany(TestPackage::class)->withTimestamps();
    }

    public function SubmissionItems(): HasMany
    {
        return $this->hasMany(SubmissionItem::class);
    }

//    public function submissions(): BelongsToMany
//    {
//        return $this->belongsToMany(Submission::class)->withTimestamps()->withPivot("deleted_at");
//    }

}
