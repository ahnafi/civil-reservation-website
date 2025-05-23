<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class News extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'thumbnail',
        'is_featured',
        'author_id',
        'news_category_id',
    ];

    public function setTitleAttribute($value)
    {
        $this->attributes['title'] = $value;
        $this->attributes['slug'] = Str::slug($value);
    }

    public function author()
    {
        return $this->belongsTo(Author::class);
    }

    public function newsCategory()
    {
        return $this->belongsTo(NewsCategory::class);
    }
}
