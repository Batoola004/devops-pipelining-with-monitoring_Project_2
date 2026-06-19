<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $featuredProducts = Product::featured()
            ->active()
            ->inStock()
            ->with('category')
            ->take(8)
            ->get()
            ->transform(fn($p) => $this->formatProduct($p));

        $categories = Category::active()
            ->ordered()
            ->withCount('products')
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
                'products_count' => $c->products_count,
            ]);

        $newProducts = Product::active()
            ->inStock()
            ->with('category')
            ->latest()
            ->take(4)
            ->get()
            ->transform(fn($p) => $this->formatProduct($p));

        return Inertia::render('home', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
            'newProducts' => $newProducts,
        ]);
    }

    private function formatProduct($product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'price' => (float) $product->price,
            'original_price' => $product->original_price ? (float) $product->original_price : null,
            'image_url' => $product->image_url,
            'has_stock' => $product->has_stock,
            'stock' => $product->stock,
            'featured' => $product->featured,
            'category' => $product->category
                ? ['id' => $product->category->id, 'name' => $product->category->name, 'slug' => $product->category->slug]
                : null,
        ];
    }
}
