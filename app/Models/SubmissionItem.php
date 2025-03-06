<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class SubmissionItem extends Pivot
{
    // protected $fillable = [
    //     "submission_id",
    //     "test_type_id",
    //     "test_package_id"
    // ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    public function testType(): BelongsTo
    {
        return $this->belongsTo(TestType::class);
    }

    public function testPackage(): BelongsTo
    {
        return $this->belongsTo(TestPackage::class);
    }
}
