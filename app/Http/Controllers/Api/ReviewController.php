<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)->firstOrFail();

        $reviews = Review::where('product_id', $product->id)
            ->where('is_approved', true)
            ->with('user:id,name')
            ->latest()
            ->paginate(10);

        return response()->json($reviews);
    }

    public function store(Request $request, string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'body' => 'nullable|string|max:5000',
        ]);

        $hasReviewed = Review::where('user_id', auth()->id())
            ->where('product_id', $product->id)
            ->exists();

        if ($hasReviewed) {
            return response()->json(['message' => 'You have already reviewed this product'], 409);
        }

        $review = Review::create([
            'user_id' => auth()->id(),
            'product_id' => $product->id,
            'rating' => $validated['rating'],
            'title' => $validated['title'] ?? null,
            'body' => $validated['body'] ?? null,
            'is_approved' => true,
        ]);

        $review->load('user:id,name');

        return response()->json([
            'review' => $review,
            'message' => 'Review submitted',
        ], 201);
    }
}
