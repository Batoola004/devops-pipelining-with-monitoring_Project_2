<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');
Route::get('/categories/{category}', [ProductController::class, 'category'])->name('products.category');

// Prometheus metrics endpoint
Route::get('/metrics', \App\Http\Controllers\MetricsController::class)
    ->middleware('throttle:60,1');
use App\Http\Controllers\SecurityController;
Route::get('/analyze-security', [SecurityController::class, 'checkStatus']);
