<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Research extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "title",
        "author",
        "abstract",
        "year",
        "publication",
        "keywords",
        "link"
    ];

    protected $casts = [
        'keywords' => 'array',
        'author' => 'array',
    ];
}
