<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;

class HomeController extends Controller
{
    public function index()
    {
        $featuredProducts = Product::featured()
            ->active()
            ->inStock()
            ->with('category')
            ->take(8)
            ->get();

        $categories = Category::active()
            ->ordered()
            ->withCount('products')
            ->get();

        $newProducts = Product::active()
            ->inStock()
            ->with('category')
            ->latest()
            ->take(4)
            ->get();

        return view('welcome', compact('featuredProducts', 'categories', 'newProducts'));
    }
}
