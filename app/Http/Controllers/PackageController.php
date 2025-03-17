<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Inertia\Inertia;
use Inertia\Response;

class PackageController extends Controller
{
    public function index(): Response
    {
        $packages = Package::with("tests")->paginate(16);
        return Inertia::render('packages/index', ["paginated" => $packages]);
    }

    public function detail(Package $package): Response
    {
        return Inertia::render('packages/detail', ["data" => $package->load("tests")]);
    }
}
