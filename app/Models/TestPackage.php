<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class TestPackage extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "name",
        "price",
        "description",
        "image"
    ];

    public function testTypes(): BelongsToMany
    {
        return $this->belongsToMany(TestType::class, "test_package_test_type", "test_package_id", "test_type_id")->withTimestamps();
    }

    public function submissionItems(): HasMany
    {
        return $this->hasMany(SubmissionItem::class);
    }

//    public function submissions(): BelongsToMany
//    {
//        return $this->belongsToMany(Submission::class)->withTimestamps()->withPivot("deleted_at");
//    }

}
