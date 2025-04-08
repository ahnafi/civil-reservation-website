<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Submission extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "code",
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

    protected static function boot(): void
    {
        parent::boot();

        static::created(function ($submission) {
            $submission->code = 'SBM' . $submission->user_id . $submission->id;
            $submission->saveQuietly();
        });
    }


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
            ->leftJoin('laboratories as test_labs', 'tests.laboratory_id', '=', 'test_labs.id')
            ->leftJoin('laboratories as package_labs', 'packages.laboratory_id', '=', 'package_labs.id')
            ->select(
                'submissions.id',
                'submissions.code',
                'submissions.company_name',
                'submissions.test_submission_date',
                'submissions.status',
                'submission_test.test_id',
                'submission_package.package_id',
                'tests.name as test_name',
                'packages.name as package_name',
                DB::raw('COALESCE(test_labs.id, package_labs.id) as lab_id'),
                DB::raw('COALESCE(test_labs.code, package_labs.code) as lab_code'),
                DB::raw('COALESCE(test_labs.name, package_labs.name) as lab_name'),
            )
            ->orderBy('submissions.test_submission_date', 'desc');
    }




}
