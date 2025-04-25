<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Package;
use App\Models\Test;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function addToCart(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'test_id' => 'required|exists:tests,id',
        ]);

        $test = Test::findOrFail($request->test_id);

        // Add to cart (polymorphic relation)
        $cart = Cart::create([
            'user_id' => $request->user_id,
            'cartable_type' => Test::class,
            'cartable_id' => $test->id,
            'quantity' => 1,
            'price' => $test->price,
        ]);
    }
}
