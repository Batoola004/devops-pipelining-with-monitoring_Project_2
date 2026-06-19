<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $categories = Category::active()->ordered();

        if ($request->with_products_count) {
            $categories->withCount('products');
        }

        return response()->json([
            'categories' => $categories->get()->map(fn($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
                'description' => $c->description,
                'image_url' => $c->image ? asset('storage/' . $c->image) : null,
                'products_count' => $c->products_count ?? 0,
                'sort_order' => $c->sort_order,
            ]),
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $category = Category::active()->where('slug', $slug)->firstOrFail();

        return response()->json([
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'image_url' => $category->image ? asset('storage/' . $category->image) : null,
                'sort_order' => $category->sort_order,
            ],
        ]);
    }
}
