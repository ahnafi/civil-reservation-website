<?php

namespace App\Http\Controllers;

use App\Models\Laboratory;
use Illuminate\Http\Request;

class LaboratoryController extends Controller
{
    public function index()
    {
        return inertia("laboratories/index", [
            "laboratories" => Laboratory::get(),
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
}
