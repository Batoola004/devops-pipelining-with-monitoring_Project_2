<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::active()->with('category');

        if ($request->category) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        if ($request->min_price) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->max_price) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->in_stock) {
            $query->where('stock', '>', 0);
        }

        if ($request->featured) {
            $query->where('featured', true);
        }

        $sort = match ($request->sort) {
            'price_asc' => ['price', 'asc'],
            'price_desc' => ['price', 'desc'],
            'name_asc' => ['name', 'asc'],
            default => ['created_at', 'desc'],
        };
        $query->orderBy(...$sort);

        $perPage = min((int) ($request->per_page ?? 12), 48);
        $products = $query->paginate($perPage);

        $products->getCollection()->transform(fn($p) => $this->formatProduct($p));

        return response()->json($products);
    }

    public function featured(): JsonResponse
    {
        $products = Product::featured()
            ->active()
            ->inStock()
            ->with('category')
            ->take(8)
            ->get()
            ->transform(fn($p) => $this->formatProduct($p));

        return response()->json(['data' => $products]);
    }

    public function show(string $slug): JsonResponse
    {
        $product = Product::active()
            ->with('category')
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Product::active()
            ->byCategory($product->category_id)
            ->where('id', '!=', $product->id)
            ->inStock()
            ->take(4)
            ->get()
            ->transform(fn($p) => $this->formatProduct($p));

        $data = $this->formatProduct($product);
        $data['related_products'] = $related;

        return response()->json(['product' => $data]);
    }

    private function formatProduct($product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'price' => (float) $product->price,
            'original_price' => $product->original_price ? (float) $product->original_price : null,
            'discount_percent' => $product->original_price
                ? round((1 - $product->price / $product->original_price) * 100)
                : null,
            'image_url' => $product->image_url,
            'images_urls' => $product->images ?? [],
            'category' => $product->category
                ? ['id' => $product->category->id, 'name' => $product->category->name, 'slug' => $product->category->slug]
                : null,
            'stock' => $product->stock,
            'has_stock' => $product->has_stock,
            'sku' => $product->sku,
            'featured' => $product->featured,
            'reviews_avg_rating' => null,
            'reviews_count' => 0,
        ];
    }
}
