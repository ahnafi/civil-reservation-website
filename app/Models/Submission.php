<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Submission extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "user_id",
        "company_name",
        "project_name",
        "project_address",
        "total_cost",
        "document",
        "test_submission_date",
        "status",
        "note",
        "approval_date"
    ];

    protected function casts(): array
    {
        return [
            "approval_date" => "datetime"
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function testing(): HasOne
    {
        return $this->hasOne(Testing::class);
    }

    public function tests(): BelongsToMany
    {
        return $this->belongsToMany(Test::class)->withTimestamps()->withPivot("quantity");
    }

    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(Package::class)->withTimestamps();
    }

    public function submissionPackages(): HasMany
    {
        return $this->hasMany(SubmissionPackage::class);
    }
    public function submissionTests(): HasMany
    {
        return $this->hasMany(SubmissionTest::class);
    }

public function scopeWithJoin($query)
{
    return $query->join('submission_tests', 'submissions.id', '=', 'submission_tests.submission_id')
        ->join('submission_packages', 'submissions.id', '=', 'submission_packages.submission_id')
        ->join('tests', 'submission_tests.test_id', '=', 'tests.id')
        ->select('submissions.id', 'submissions.status', 'submissions.company_name', 'submission_tests.test_id', 'submission_packages.package_id', 'tests.name');
}

}
