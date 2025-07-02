<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubmissionInternalDetail extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'program_study',
        'research_title',
        'personnel_count',
        'supervisor',
    ];

    public function submission(): HasOne
    {
        return $this->hasOne(Submission::class, 'submission_internal_detail_id');
    }

    public function testings(): HasManyThrough
    {
        return $this->hasManyThrough(
            Testing::class,
            Submission::class,
            'submission_internal_detail_id', // Foreign key on submissions table
            'submission_id', // Foreign key on testing table
            'id', // Local key on submission_internal_details table
            'id' // Local key on submissions table
        );
    }
}
