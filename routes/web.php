<?php

use App\Http\Controllers\HomeController;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Products
Route::get('/products', function () {
    $categories = Category::active()->ordered()->withCount('products')->get();

    $query = Product::active()->with('category');

    $categorySlug = request('category');
    if ($categorySlug) {
        $category = Category::whereSlug($categorySlug)->first();
        $query->whereHas('category', fn($q) => $q->where('slug', $categorySlug));
    } else {
        $category = null;
    }

    if (request('search')) {
        $s = request('search');
        $query->where(function ($q) use ($s) {
            $q->where('name', 'like', "%{$s}%")
                ->orWhere('description', 'like', "%{$s}%");
        });
    }

    if (request('featured')) {
        $query->where('featured', true);
    }

    $sort = match (request('sort')) {
        'price_asc' => ['price', 'asc'],
        'price_desc' => ['price', 'desc'],
        'name_asc' => ['name', 'asc'],
        default => ['created_at', 'desc'],
    };
    $query->orderBy(...$sort);

    $products = $query->paginate(12);
    $initialProducts = [
        'data' => $products->items(),
        'meta' => [
            'current_page' => $products->currentPage(),
            'last_page' => $products->lastPage(),
            'total' => $products->total(),
        ],
    ];
    return Inertia::render('shop', [
        'categories' => $categories,
        'category' => $category,
        'initialProducts' => $initialProducts,
        'initialSort' => request('sort', ''),
        'initialFeatured' => request('featured', ''),
        'initialSearch' => request('search', ''),
    ]);
})->name('products.index');

Route::get('/products/{product:slug}', function (Product $product) {
    if (!$product->is_active)
        abort(404);
    $product->load('category');
    $related = Product::active()->byCategory($product->category_id)
        ->where('id', '!=', $product->id)->inStock()->take(4)->get();
    return Inertia::render('product-detail', ['product' => $product, 'relatedProducts' => $related]);
})->name('products.show');

// Cart / Checkout / Orders
Route::get('/cart', fn() => Inertia::render('cart'))->name('cart');
Route::get('/checkout', fn() => Inertia::render('checkout'))->name('checkout');
Route::get('/orders', fn() => Inertia::render('orders'))->name('orders');
Route::get('/orders/{order}', function (App\Models\Order $order) {
    if ($order->user_id !== auth()->id())
        abort(403);
    $order->load('items');
    return Inertia::render('order-detail', ['order' => $order]);
})->name('orders.show');
Route::get('/orders/{order}/confirmation', function (App\Models\Order $order) {
    if ($order->user_id !== auth()->id())
        abort(403);
    $order->load('items');
    return Inertia::render('order-confirmation', ['order' => $order]);
})->name('orders.confirmation');

// Wishlist
Route::get('/wishlist', fn() => Inertia::render('wishlist'))->name('wishlist');

// Search
Route::get('/search', function () {
    $query = request('q', '');
    return Inertia::render('search-results', ['query' => $query]);
})->name('search');

// Auth pages
Route::get('/login', fn() => Inertia::render('login'))->name('login');
Route::get('/register', fn() => Inertia::render('register'))->name('register');
Route::get('/forgot-password', fn() => Inertia::render('forgot-password'))->name('forgot-password');

// Static pages
Route::get('/about', fn() => Inertia::render('about'))->name('about');
Route::get('/contact', fn() => Inertia::render('contact'))->name('contact');

// Help pages
Route::get('/faq', fn() => Inertia::render('faq'))->name('faq');
Route::get('/shipping', fn() => Inertia::render('shipping'))->name('shipping');
Route::get('/returns', fn() => Inertia::render('returns'))->name('returns');

// Prometheus metrics
Route::get('/metrics', \App\Http\Controllers\MetricsController::class)
    ->middleware('throttle:60,1');
use App\Http\Controllers\SecurityController;
Route::get('/analyze-security', [SecurityController::class, 'checkStatus']);
// Health check
Route::get('/health', \App\Http\Controllers\HealthController::class)
    ->middleware('throttle:60,1');
