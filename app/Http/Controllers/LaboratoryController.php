<?php

namespace App\Http\Controllers;

use App\Models\Laboratory;
use Illuminate\Http\Request;

class LaboratoryController extends Controller
{
    public function show(Laboratory $laboratory)
    {
        return inertia("laboratory/show", [
            "laboratory" => $laboratory,
            "tests" => $laboratory->tests()->with("packages")->with('category')->get(),
            "packages" => $laboratory->packages()->with("tests")->get(),
        ]);
    }
}
