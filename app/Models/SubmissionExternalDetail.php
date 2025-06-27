<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
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
}
