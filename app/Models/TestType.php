<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
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
        return $this->belongsToMany(TestPackage::class, "test_package_test_type", "test_type_id", "test_package_id")->withTimestamps();
    }

    public function SubmissionItems(): HasMany
    {
        return $this->hasMany(SubmissionItem::class);
    }

    public function unitCategory(): BelongsTo
    {
        return $this->belongsTo(UnitCategory::class);
    }

    public function laboratory(): BelongsTo
    {
        return $this->belongsTo(Laboratory::class);
    }

//    public function submissions(): BelongsToMany
//    {
//        return $this->belongsToMany(Submission::class)->withTimestamps()->withPivot("deleted_at");
//    }

}
