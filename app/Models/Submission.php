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

    public function scopeWithScheduleJoin($query)
    {
        return $query
            ->leftJoin('submission_test', 'submissions.id', '=', 'submission_test.submission_id')
            ->leftJoin('submission_package', 'submissions.id', '=', 'submission_package.submission_id')
            ->leftJoin('tests', 'submission_test.test_id', '=', 'tests.id')
            ->leftJoin('packages', 'submission_package.package_id', '=', 'packages.id')
            ->leftJoin('laboratories', 'tests.laboratory_id', '=', 'laboratories.id')
            ->select(
                'submissions.id',
                'submissions.company_name',
                'submissions.test_submission_date',
                'submissions.status',
                'submission_test.test_id',
                'submission_package.package_id',
                'tests.name as test_name',
                'packages.name as package_name',
                'laboratories.id as lab_id',
                'laboratories.code as lab_code',
                'laboratories.name as lab_name',
            )
            ->orderBy('submissions.test_submission_date', 'desc');
    }


}
