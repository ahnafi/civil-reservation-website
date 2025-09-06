<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Testing;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Menampilkan semua review
     */
    public function index()
    {
        // $reviews = Review::with('testing')->get();
        // $reviews = Review::all();
        $reviews = Review::orderBy('created_at', 'desc')->get();
        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'required|string|max:1000',
            'testing_id' => 'required|exists:testings,id',
        ]);

        // Check if testing is completed
        $testing = Testing::findOrFail($request->testing_id);
        if ($testing->status !== 'completed' || !$testing->completed_at) {
            return redirect()->back()->with('error', 'Review hanya dapat diberikan untuk pengujian yang sudah selesai');
        }

        // Check if user already reviewed this testing
        $existingReview = Review::where('testing_id', $request->testing_id)->first();
        if ($existingReview) {
            return redirect()->back()->with('error', 'Anda sudah memberikan review untuk pengujian ini');
        }

        $review = Review::create([
            'rating' => $request->input('rating'),
            'content' => $request->input('content'),
            'testing_id' => $request->input('testing_id'),
        ]);

        return redirect()->back()->with('success', 'Review berhasil dikirim. Terima kasih atas feedback Anda!');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'required|string|max:1000',
        ]);

        $review = Review::findOrFail($id);

        // Check if testing is still completed
        $testing = Testing::findOrFail($review->testing_id);
        if ($testing->status !== 'completed' || !$testing->completed_at) {
            return redirect()->back()->with('error', 'Review hanya dapat diubah untuk pengujian yang sudah selesai');
        }

        $review->update([
            'rating' => $request->input('rating'),
            'content' => $request->input('content'),
        ]);


        return redirect()->back()->with('success', 'Review berhasil diperbarui. Terima kasih atas feedback Anda!');
    }
}
