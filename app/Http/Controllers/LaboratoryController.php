<?php

namespace App\Http\Controllers;

use App\Models\Laboratory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class LaboratoryController extends Controller
{
    public function index()
    {
        return inertia("laboratories/index", [
            "laboratories" => Laboratory::get(),
        ]);
    }

    public function apiIndex(): LengthAwarePaginator
    {
        return Laboratory::with(["equipments", "packages", "tests"])->paginate(16);
    }

    public function apiDetail(Laboratory $Laboratory): JsonResponse
    {
        return response()->json([
            'data' => $Laboratory->load(["equipments", "packages", "tests"]),
        ]);
    }

    public function detail(Laboratory $laboratory)
    {
        return inertia("laboratories/detail", [
            "laboratory" => $laboratory,
            "tests" => $laboratory->tests()->with("packages")->with('category')->get(),
            "packages" => $laboratory->packages()->with("tests")->get(),
        ]);
    }

    public function carouselLaboratories(): JsonResponse
    {
        $laboratories = Laboratory::select(['id', 'name', 'images'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $laboratories,
            'message' => 'Data laboratorium untuk carousel berhasil diambil'
        ]);
    }
}
