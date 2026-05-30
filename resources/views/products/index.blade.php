<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ isset($category) ? $category->name : 'All Products' }} - FiberRoad</title>

    @fonts

    @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    @else
        <style>
            @layer theme{:root,:host{--font-sans:"Instrument Sans", ui-sans-serif, system-ui, sans-serif;--color-gray-50:oklch(98.5% .002 247.839);--color-gray-100:oklch(96.7% .003 264.542);--color-gray-200:oklch(92.8% .006 264.531);--color-gray-300:oklch(87.2% .01 258.338);--color-gray-400:oklch(70.7% .022 261.325);--color-gray-500:oklch(55.1% .027 264.364);--color-gray-600:oklch(44.6% .03 256.802);--color-gray-700:oklch(37.3% .034 259.733);--color-gray-800:oklch(27.8% .033 256.848);--color-gray-900:oklch(21% .034 264.665);--color-blue-50:oklch(97% .014 254.604);--color-blue-100:oklch(93.2% .032 255.585);--color-blue-200:oklch(88.2% .059 254.128);--color-blue-300:oklch(80.9% .105 251.813);--color-blue-400:oklch(70.7% .165 254.624);--color-blue-500:oklch(62.3% .214 259.815);--color-blue-600:oklch(54.6% .245 262.881);--color-blue-700:oklch(48.8% .243 264.376);--color-white:#fff;--color-black:#000;--spacing:.25rem;--container-4xl:56rem;--container-7xl:80rem;--text-sm:.875rem;--text-base:1rem;--text-lg:1.125rem;--text-xl:1.25rem;--text-2xl:1.5rem;--text-3xl:1.875rem;--text-4xl:2.25rem;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--font-weight-extrabold:800;--radius-lg:.5rem;--radius-xl:.75rem;--radius-2xl:1rem;--shadow-sm:0 1px 3px 0 #0000001a, 0 1px 2px -1px #0000001a;--shadow-md:0 4px 6px -1px #0000001a, 0 2px 4px -2px #0000001a;--shadow-xl:0 20px 25px -5px #0000001a, 0 8px 10px -6px #0000001a;--default-transition-duration:.15s}}
            @layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--font-sans)}a{color:inherit;text-decoration:inherit}img,video{max-width:100%;height:auto}button{cursor:pointer}ol,ul{list-style:none}}
            @layer components{.btn{display:inline-flex;align-items:center;justify-content:center;border-radius:.5rem;padding:.5rem 1.25rem;font-weight:600;font-size:.875rem;transition:all .15s ease}.btn-primary{background:#2563eb;color:#fff}.btn-primary:hover{background:#1d4ed8}.btn-outline{border:1px solid #e5e7eb;color:#374151}.btn-outline:hover{background:#f9fafb}.product-card{background:#fff;border-radius:.75rem;overflow:hidden;transition:all .2s ease;border:1px solid #f3f4f6}.product-card:hover{border-color:#e5e7eb;box-shadow:0 4px 6px -1px #0000001a, 0 2px 4px -2px #0000001a}.pagination a,.pagination span{display:inline-flex;align-items:center;justify-content:center;padding:.375rem .75rem;font-size:.875rem;border-radius:.375rem;border:1px solid #e5e7eb;color:#374151;transition:all .15s ease}.pagination a:hover{background:#f9fafb}.pagination .active{background:#2563eb;color:#fff;border-color:#2563eb}}
            body{font-family:"Instrument Sans", ui-sans-serif, system-ui, sans-serif}
        </style>
    @endif
</head>
<body class="bg-gray-50 text-gray-900 antialiased">

{{-- Navigation --}}
<nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <a href="/" class="flex items-center space-x-2">
                <svg class="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
                <span class="text-xl font-bold text-gray-900">FiberRoad</span>
            </a>
            <div class="hidden md:flex items-center space-x-8">
                <a href="/" class="text-gray-600 hover:text-blue-600 font-medium transition">Home</a>
                <a href="{{ route('products.index') }}" class="text-blue-600 font-semibold transition">Shop</a>
            </div>
        </div>
    </div>
</nav>

{{-- Page Header --}}
<section class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">
                    {{ isset($category) ? $category->name : 'All Products' }}
                </h1>
                <p class="text-gray-500 mt-1">{{ $products->total() }} products found</p>
            </div>
        </div>
    </div>
</section>

{{-- Main Content --}}
<section class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex gap-8">
            {{-- Sidebar Filters --}}
            <aside class="hidden lg:block w-64 flex-shrink-0">
                <div class="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                    <h3 class="font-semibold text-gray-900 mb-4">Categories</h3>
                    <ul class="space-y-2">
                        <li>
                            <a href="{{ route('products.index') }}"
                               class="flex items-center justify-between py-1.5 text-sm {{ !isset($category) ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900' }} transition">
                                <span>All Products</span>
                                <span class="text-xs text-gray-400">({{ $products->total() }})</span>
                            </a>
                        </li>
                        @foreach($categories as $cat)
                            <li>
                                <a href="{{ route('products.category', $cat) }}"
                                   class="flex items-center justify-between py-1.5 text-sm {{ isset($category) && $category->id === $cat->id ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900' }} transition">
                                    <span>{{ $cat->name }}</span>
                                </a>
                            </li>
                        @endforeach
                    </ul>
                </div>
            </aside>

            {{-- Product Grid --}}
            <div class="flex-1">
                @if($products->isEmpty())
                    <div class="text-center py-20">
                        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                        </svg>
                        <h3 class="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                        <p class="text-gray-400">Check back later for new arrivals.</p>
                    </div>
                @else
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        @foreach($products as $product)
                            <a href="{{ route('products.show', $product) }}" class="product-card group">
                                <div class="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                                    <div class="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                        </svg>
                                    </div>
                                    @if($product->original_price)
                                        <span class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">SALE</span>
                                    @endif
                                    @if(!$product->has_stock)
                                        <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span class="bg-white text-gray-900 text-sm font-semibold px-4 py-1.5 rounded-full">Out of Stock</span>
                                        </div>
                                    @endif
                                </div>
                                <div class="p-4">
                                    <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">{{ $product->category?->name }}</p>
                                    <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">{{ $product->name }}</h3>
                                    <div class="mt-2 flex items-center gap-2">
                                        <span class="text-lg font-bold text-gray-900">${{ number_format($product->price, 2) }}</span>
                                        @if($product->original_price)
                                            <span class="text-sm text-gray-400 line-through">${{ number_format($product->original_price, 2) }}</span>
                                        @endif
                                    </div>
                                </div>
                            </a>
                        @endforeach
                    </div>

                    {{-- Pagination --}}
                    <div class="mt-10">
                        {{ $products->links() }}
                    </div>
                @endif
            </div>
        </div>
    </div>
</section>

{{-- Footer --}}
<footer class="bg-gray-900 text-gray-300 py-12 mt-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
                <svg class="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
                <span class="text-xl font-bold text-white">FiberRoad</span>
            </div>
            <p class="text-sm text-gray-500">&copy; {{ date('Y') }} FiberRoad.</p>
        </div>
    </div>
</footer>

</body>
</html>
