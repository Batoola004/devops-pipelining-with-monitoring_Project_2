<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = $request->q;

        if (!$query || strlen($query) < 2) {
            return response()->json(['data' => [], 'meta' => ['total' => 0]]);
        }

        $products = Product::active()
            ->with('category')
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%");
            })
            ->orderByRaw("CASE WHEN name LIKE ? THEN 0 ELSE 1 END", ["{$query}%"])
            ->orderBy('created_at', 'desc')
            ->paginate(min($request->per_page ?? 12, 48));

        $products->getCollection()->transform(fn($p) => [
            'id' => $p->id,
            'name' => $p->name,
            'slug' => $p->slug,
            'price' => (float) $p->price,
            'original_price' => $p->original_price ? (float) $p->original_price : null,
            'image_url' => $p->image_url,
            'has_stock' => $p->has_stock,
            'category' => $p->category
                ? ['id' => $p->category->id, 'name' => $p->category->name, 'slug' => $p->category->slug]
                : null,
        ]);

        return response()->json([
            ...$products->toArray(),
            'query' => $query,
        ]);
    }
}
