<?php

namespace App\Http\Controllers;

use App\Models\Reviews;
use App\Models\Testing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
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
        $existingReview = Reviews::where('testing_id', $request->testing_id)->first();
        if ($existingReview) {
            return redirect()->back()->with('error', 'Anda sudah memberikan review untuk pengujian ini');
        }

        $review = Reviews::create([
            'rating' => $request->rating,
            'content' => $request->content,
            'testing_id' => $request->testing_id,
        ]);

        return redirect()->back()->with('success', 'Review berhasil dikirim. Terima kasih atas feedback Anda!');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'required|string|max:1000',
        ]);

        $review = Reviews::findOrFail($id);

        // Check if testing is still completed
        $testing = Testing::findOrFail($review->testing_id);
        if ($testing->status !== 'completed' || !$testing->completed_at) {
            return redirect()->back()->with('error', 'Review hanya dapat diubah untuk pengujian yang sudah selesai');
        }

        $review->update([
            'rating' => $request->rating,
            'content' => $request->content,
        ]);

        return redirect()->back()->with('success', 'Review berhasil diperbarui. Terima kasih atas feedback Anda!');
    }
}
