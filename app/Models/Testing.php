<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Testing extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "status", "note", "test_date", "completed_at", "submission_id"
    ];
}
