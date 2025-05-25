<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Test;
use Inertia\Response;

class CartController extends Controller
{
    public function cart(): Response
    {
        $tests = Test::active()->get();
        $packages = Package::get();

        return inertia('orders/cart', [
            'tests' => $tests,
            'packages' => $packages,
        ]);
    }
}
