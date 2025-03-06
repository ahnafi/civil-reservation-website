<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Submission extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "company_name",
        "project_name",
        "project_address",
        "unit_qty",
        "status",
        "note",
        "total_cost",
        "approval_date",
        "user_id"
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function test(): HasOne
    {
        return $this->hasOne(Test::class);
    }

    public function submissionItems(): HasMany
    {
        return $this->hasMany(SubmissionItem::class);
    }

    public function testTypes(): BelongsToMany
    {
        return $this->belongsToMany(TestType::class, "submission_item")->withTimestamps();
    }

    public function testPackages(): BelongsToMany
    {
        return $this->belongsToMany(TestPackage::class, "submission_item")->withTimestamps();
    }
}
