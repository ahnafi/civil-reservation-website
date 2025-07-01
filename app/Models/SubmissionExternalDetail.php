<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubmissionExternalDetail extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'company_name',
        'project_name',
        'project_address',
        'total_cost',
    ];

    public function submission(): HasOne
    {
        return $this->hasOne(Submission::class);
    }

    public function transactions(): HasManyThrough
    {
        return $this->hasManyThrough(
            Transaction::class,
            Submission::class,
            'submission_external_detail_id', // Foreign key on submissions table
            'submission_id', // Foreign key on transactions table
            'id', // Local key on submission_external_details table
            'id' // Local key on submissions table
        );
    }

    public function testings(): HasManyThrough
    {
        return $this->hasManyThrough(
            Testing::class,
            Submission::class,
            'submission_external_detail_id', // Foreign key on submissions table
            'submission_id', // Foreign key on testing table
            'id', // Local key on submission_external_details table
            'id' // Local key on submissions table
        );
    }
}
