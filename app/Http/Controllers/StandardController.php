<?php

namespace App\Http\Controllers;

use App\Models\Standard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StandardController extends Controller
{
    public function index(): JsonResponse
    {
        $standards = Standard::orderBy("created_at", "desc")->get();
        
        return response()->json([
            'success' => true,
            'data' => $standards,
            'message' => 'Data standard berhasil diambil'
        ]);
    }

    public function show(Standard $standard): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $standard,
            'message' => 'Detail standard berhasil diambil'
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $query = $request->input('q');

        $standards = Standard::where('nama', 'like', "%{$query}%")
            ->orWhere('deskripsi', 'like', "%{$query}%")
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $standards,
            'message' => 'Pencarian standard berhasil',
            'query' => $query
        ]);
    }
}
