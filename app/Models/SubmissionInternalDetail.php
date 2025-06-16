<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class SubmissionInternalDetail extends Model
{
    protected $fillable = [
        'name',
        'program_study',
        'research_title',
        'personnel_count',
        'supervisor',
    ];

    public function submission(): HasOne
    {
        return $this->hasOne(Submission::class, 'submission_id');
    }
}
