<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(): JsonResponse
    {
        $items = Wishlist::where('user_id', auth()->id())
            ->with('product.category')
            ->latest()
            ->get();

        return response()->json([
            'items' => $items->map(fn($w) => [
                'id' => $w->id,
                'product_id' => $w->product_id,
                'product' => [
                    'id' => $w->product->id,
                    'name' => $w->product->name,
                    'slug' => $w->product->slug,
                    'price' => (float) $w->product->price,
                    'original_price' => $w->product->original_price ? (float) $w->product->original_price : null,
                    'image_url' => $w->product->image_url,
                    'has_stock' => $w->product->has_stock,
                    'category' => $w->product->category
                        ? ['name' => $w->product->category->name, 'slug' => $w->product->category->slug]
                        : null,
                ],
                'created_at' => $w->created_at,
            ]),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate(['product_id' => 'required|exists:products,id']);

        $exists = Wishlist::where('user_id', auth()->id())
            ->where('product_id', $validated['product_id'])
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Already in wishlist'], 409);
        }

        Wishlist::create([
            'user_id' => auth()->id(),
            'product_id' => $validated['product_id'],
        ]);

        return response()->json(['message' => 'Added to wishlist'], 201);
    }

    public function destroy(Product $product): JsonResponse
    {
        Wishlist::where('user_id', auth()->id())
            ->where('product_id', $product->id)
            ->delete();

        return response()->json(['message' => 'Removed from wishlist']);
    }
}
