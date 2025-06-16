<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class News extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'thumbnail',
        // 'is_featured',
        'author_id',
        'news_category_id',
    ];

    public static function boot()
    {
        parent::boot();

        static::updating(function ($model) {
            // Handle thumbnail changes
            if ($model->isDirty('thumbnail')) {
                $originalThumbnail = $model->getOriginal('thumbnail');
                $newThumbnail = $model->thumbnail;

                if ($originalThumbnail && $originalThumbnail !== $newThumbnail && Storage::disk('public')->exists($originalThumbnail)) {
                    Storage::disk('public')->delete($originalThumbnail);
                }
            }

            // Handle RichEditor image cleanup
            if ($model->isDirty('content')) {
                $originalContent = $model->getOriginal('content') ?? '';
                $newContent = $model->content ?? '';

                $originalFiles = static::getImagePathsFromHtml($originalContent);
                $newFiles = static::getImagePathsFromHtml($newContent);

                $removedFiles = array_diff($originalFiles, $newFiles);

                foreach ($removedFiles as $file) {
                    if (Storage::disk('public')->exists($file)) {
                        Storage::disk('public')->delete($file);
                    }
                }
            }
        });

        static::deleting(function ($model) {
            if (!empty($model->thumbnail) && Storage::disk('public')->exists($model->thumbnail)) {
                Storage::disk('public')->delete($model->thumbnail);
            }

            $contentFiles = static::getImagePathsFromHtml($model->content ?? '');

            foreach ($contentFiles as $file) {
                if (Storage::disk('public')->exists($file)) {
                    Storage::disk('public')->delete($file);
                }
            }
        });
    }

    public static function getImagePathsFromHtml(string $html): array
    {
        $matches = [];

        preg_match_all('/<img[^>]+src="([^"]+)"[^>]*>/i', $html, $matches);

        $paths = [];
        foreach ($matches[1] as $url) {
            if (Str::contains($url, '/storage/')) {
                $relativePath = str_replace('/storage/', '', parse_url($url, PHP_URL_PATH));
                $paths[] = $relativePath;
            }
        }

        return $paths;
    }


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
