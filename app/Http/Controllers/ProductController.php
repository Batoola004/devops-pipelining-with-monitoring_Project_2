<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::active()
            ->with('category')
            ->latest()
            ->paginate(12);

        $categories = Category::active()->ordered()->get();

        return view('products.index', compact('products', 'categories'));
    }

    public function show(Product $product)
    {
        if (!$product->is_active) {
            abort(404);
        }

        $relatedProducts = Product::active()
            ->byCategory($product->category_id)
            ->where('id', '!=', $product->id)
            ->inStock()
            ->take(4)
            ->get();

        return view('products.show', compact('product', 'relatedProducts'));
    }

    public function category(Category $category)
    {
        $products = Product::active()
            ->byCategory($category->id)
            ->with('category')
            ->latest()
            ->paginate(12);

        $categories = Category::active()->ordered()->get();

        return view('products.index', compact('products', 'categories', 'category'));
    }
}
