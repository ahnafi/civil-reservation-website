<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class NewsController extends Controller
{
    public function index(): LengthAwarePaginator
    {
        return News::with(["author", "newsCategory"])->orderBy("created_at", "desc")
            ->paginate(8);
    }

    public function show(News $news): JsonResponse
    {
        return response()->json([
            'data' => $news->load(['author', 'newsCategory']),
        ]);
    }

    public function search(Request $request): LengthAwarePaginator
    {
        $query = $request->input('q');
        $perPage = $request->input('per_page', 16);
        $category = $request->input('category');

        $newsQuery = News::query()
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                    ->orWhere('content', 'like', "%{$query}%");
            });

        if ($category) {
            $newsQuery->whereHas('newsCategory', function ($q) use ($category) {
                $q->where('slug', $category)
                  ->orWhere('name', 'like', "%{$category}%");
            });
        }

        return $newsQuery->with(['author', 'newsCategory'])->paginate($perPage);
    }
}
