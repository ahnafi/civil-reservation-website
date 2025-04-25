<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Package;
use App\Models\Test;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;

class BookingController extends Controller
{
    public function addToCart(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required|exists:users,id',
                'test_id' => 'required|exists:tests,id',
            ]);

            $test = Test::findOrFail($request->test_id);

            $cart = Cart::create([
                'user_id' => $request->user_id,
                'cartable_type' => Test::class,
                'cartable_id' => $test->id,
                'quantity' => 1,
                'price' => $test->price,
            ]);

            return redirect()->route('tests')
                ->with('success', 'Pengujian berhasil ditambahkan ke keranjang!');

        } catch (ModelNotFoundException $e) {
            return redirect()->route('tests')
                ->with('error', 'Test or User not found.');

        } catch (QueryException $e) {
            return redirect()->route('tests')
                ->with('error', 'Database error occurred while adding to the cart.');

        } catch (\Exception $e) {
            return redirect()->route('tests')
                ->with('error', 'An unexpected error occurred.');
        }
    }
}
