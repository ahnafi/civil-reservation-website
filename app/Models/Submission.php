<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Submission extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "code",
        "user_id",
        "submission_type",
        "internal_detail_id",
        "external_detail_id",
        "documents",
        "test_submission_date",
        "user_note",
        "admin_note",
        "status",
        "approval_date"
    ];

    protected $casts = [
        'document' => 'array',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::created(function ($submission) {
            try {
                $paddedUserId = str_pad($submission->user_id, 3, '0', STR_PAD_LEFT);
                $paddedId = str_pad($submission->id, 3, '0', STR_PAD_LEFT);
                $date = Carbon::parse($submission->test_submission_date)->format('Ymd');

                $submission->code = 'SBM-' . $paddedUserId . $paddedId;
                $submission->saveQuietly();
            } catch (\Throwable $e) {
                Log::error('Submission code generation failed', ['error' => $e->getMessage()]);
            }
        });

        static::updating(function ($model) {
            if ($model->isDirty('documents')) {
                $originalDocuments = $model->getOriginal('documents') ?? [];
                $newDocuments = $model->documents ?? [];

                $removedDocuments = array_diff($originalDocuments, $newDocuments);

                foreach ($removedDocuments as $removedDocument) {
                    if (Storage::disk('public')->exists($removedDocument)) {
                        Storage::disk('public')->delete($removedDocument);
                    }
                }
            }
        });

        static::deleting(function ($model) {
            if (!empty($model->documents)) {
                foreach ($model->documents as $filename) {
                    if (Storage::disk('public')->exists($filename)) {
                        Storage::disk('public')->delete($filename);
                    }
                }
            }
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
        return $this->belongsToMany(Test::class, 'submission_test')->withTimestamps()->withPivot('quantity');
    }

    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(Package::class, 'submission_package')->withTimestamps();
    }

    public function submissionPackages(): HasMany
    {
        return $this->hasMany(SubmissionPackage::class);
    }
    public function submissionTests(): HasMany
    {
        return $this->hasMany(SubmissionTest::class);
    }

    public function internalDetail(): BelongsTo
    {
        return $this->belongsTo(InternalDetail::class, 'internal_detail_id');
    }

    public function externalDetail(): BelongsTo
    {
        return $this->belongsTo(ExternalDetail::class, 'external_detail_id');
    }

    public function scopeWithUserScheduleJoin($query)
    {
        return $query
            ->leftJoin('submission_test', 'submissions.id', '=', 'submission_test.submission_id')
            ->leftJoin('submission_package', 'submissions.id', '=', 'submission_package.submission_id')
            ->leftJoin('tests', 'submission_test.test_id', '=', 'tests.id')
            ->leftJoin('packages', 'submission_package.package_id', '=', 'packages.id')
            ->leftJoin('laboratories as test_labs', 'tests.laboratory_id', '=', 'test_labs.id')
            ->leftJoin('laboratories as package_labs', 'packages.laboratory_id', '=', 'package_labs.id')
            // Tambahkan join untuk detail tables
            ->leftJoin('submission_external_details', 'submissions.external_detail_id', '=', 'submission_external_details.id')
            ->leftJoin('submission_internal_details', 'submissions.internal_detail_id', '=', 'submission_internal_details.id')
            ->select(
                'submissions.id',
                'submissions.code',
                'submissions.submission_type',
                'submissions.test_submission_date',
                'submissions.status',
                'submissions.user_note',
                'submission_test.test_id',
                'submission_package.package_id',
                'tests.name as test_name',
                'packages.name as package_name',
                DB::raw('COALESCE(test_labs.id, package_labs.id) as lab_id'),
                DB::raw('COALESCE(test_labs.code, package_labs.code) as lab_code'),
                DB::raw('COALESCE(test_labs.name, package_labs.name) as lab_name'),
                // External detail fields
                'submission_external_details.company_name',
                'submission_external_details.project_name',
                'submission_external_details.project_address',
                'submission_external_details.total_cost',
                // Internal detail fields  
                'submission_internal_details.name',
                'submission_internal_details.program_study',
                'submission_internal_details.research_title',
                'submission_internal_details.personnel_count',
                'submission_internal_details.supervisor'
            )
            ->orderBy('submissions.created_at', 'desc');
    }
}
