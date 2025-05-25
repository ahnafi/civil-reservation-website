<?php

namespace App\Http\Controllers;

use App\Models\Research;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class ResearchController extends Controller
{
    public function index(): LengthAwarePaginator
    {
        return Research::paginate(16);
    }

    public function search(Request $request): LengthAwarePaginator
    {
        $query = $request->input('q');
        $perPage = $request->input('per_page', 16);
        $year = $request->input('year');

        $researchQuery = Research::query()
            ->where(function ($q) use ($query): void {
                $q->where('title', 'like', "%{$query}%")
                    ->orWhere('author', 'like', "%{$query}%")
                    ->orWhere('abstract', 'like', "%{$query}%")
                    ->orWhere('keywords', 'like', "%{$query}%");
            });

        if ($year) {
            $researchQuery->where('year', $year);
        }

        return $researchQuery->paginate($perPage);
    }
}
