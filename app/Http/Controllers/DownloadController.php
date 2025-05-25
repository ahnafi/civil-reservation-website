<?php

namespace App\Http\Controllers;

use App\Models\Download;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class DownloadController extends Controller
{
    public function index(): LengthAwarePaginator
    {
        return Download::paginate(16);
    }

    public function search(Request $request): LengthAwarePaginator
    {
        $query = $request->input('q');
        $perPage = $request->input('per_page', 16);

        $downloadQuery = Download::query()
            ->where(function ($q) use ($query): void {
                $q->where('title', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%");
            });

        return $downloadQuery->paginate($perPage);
    }
}
