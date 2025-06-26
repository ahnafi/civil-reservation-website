<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ExternalDetail extends Model
{
    protected $fillable = [
        'company_name',
        'project_name',
        'project_address',
        'total_cost',
    ];

    public function submission(): HasOne
    {
        return $this->hasOne(Submission::class, 'submission_id');
    }
}
