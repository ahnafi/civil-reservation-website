<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Submission extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "user_id", "company_name", "project_name", "project_address", "total_cost", "document", "status", "note", "approval_date"
    ];
}
