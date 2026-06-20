<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $product->name }} - FiberRoad</title>

    @fonts

    @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    @else
        <style>
            @layer theme{:root,:host{--font-sans:"Instrument Sans", ui-sans-serif, system-ui, sans-serif;--color-gray-50:oklch(98.5% .002 247.839);--color-gray-100:oklch(96.7% .003 264.542);--color-gray-200:oklch(92.8% .006 264.531);--color-gray-300:oklch(87.2% .01 258.338);--color-gray-400:oklch(70.7% .022 261.325);--color-gray-500:oklch(55.1% .027 264.364);--color-gray-600:oklch(44.6% .03 256.802);--color-gray-700:oklch(37.3% .034 259.733);--color-gray-800:oklch(27.8% .033 256.848);--color-gray-900:oklch(21% .034 264.665);--color-blue-50:oklch(97% .014 254.604);--color-blue-100:oklch(93.2% .032 255.585);--color-blue-200:oklch(88.2% .059 254.128);--color-blue-300:oklch(80.9% .105 251.813);--color-blue-400:oklch(70.7% .165 254.624);--color-blue-500:oklch(62.3% .214 259.815);--color-blue-600:oklch(54.6% .245 262.881);--color-blue-700:oklch(48.8% .243 264.376);--color-green-500:oklch(72.3% .219 149.579);--color-green-600:oklch(62.7% .194 149.214);--color-red-500:oklch(63.7% .237 25.331);--color-red-600:oklch(57.7% .245 27.325);--color-white:#fff;--color-black:#000;--spacing:.25rem;--container-4xl:56rem;--container-7xl:80rem;--text-sm:.875rem;--text-base:1rem;--text-lg:1.125rem;--text-xl:1.25rem;--text-2xl:1.5rem;--text-3xl:1.875rem;--text-4xl:2.25rem;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--radius-lg:.5rem;--radius-xl:.75rem;--radius-2xl:1rem;--shadow-md:0 4px 6px -1px #0000001a, 0 2px 4px -2px #0000001a;--shadow-xl:0 20px 25px -5px #0000001a, 0 8px 10px -6px #0000001a;--default-transition-duration:.15s}}
            @layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--font-sans)}a{color:inherit;text-decoration:inherit}img,video{max-width:100%;height:auto}button,input{cursor:pointer;font:inherit;color:inherit;background-color:#0000;border-radius:0}ol,ul{list-style:none}}
            @layer components{.btn{display:inline-flex;align-items:center;justify-content:center;border-radius:.5rem;padding:.5rem 1.25rem;font-weight:600;font-size:.875rem;transition:all .15s ease}.btn-primary{background:#2563eb;color:#fff}.btn-primary:hover{background:#1d4ed8}.btn-primary:disabled{background:#93c5fd;cursor:not-allowed}.btn-outline{border:1px solid #e5e7eb;color:#374151}.btn-outline:hover{background:#f9fafb}.product-card{background:#fff;border-radius:.75rem;overflow:hidden;transition:all .2s ease;border:1px solid #f3f4f6}.product-card:hover{border-color:#e5e7eb;box-shadow:0 4px 6px -1px #0000001a, 0 2px 4px -2px #0000001a}}
            body{font-family:"Instrument Sans", ui-sans-serif, system-ui, sans-serif}
        </style>
    @endif
</head>
<body class="bg-gray-50 text-gray-900 antialiased">


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
                <a href="{{ route('products.index') }}" class="text-gray-600 hover:text-blue-600 font-medium transition">Shop</a>
            </div>
        </div>
    </div>
</nav>


<section class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div class="flex items-center space-x-2 text-sm text-gray-500">
            <a href="/" class="hover:text-blue-600 transition">Home</a>
            <span>/</span>
            <a href="{{ route('products.index') }}" class="hover:text-blue-600 transition">Shop</a>
            @if($product->category)
                <span>/</span>
                <a href="{{ route('products.category', $product->category) }}" class="hover:text-blue-600 transition">{{ $product->category->name }}</a>
            @endif
            <span>/</span>
            <span class="text-gray-900 font-medium">{{ $product->name }}</span>
        </div>
    </div>
</section>


<section class="py-8 lg:py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            
            <div class="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div class="text-gray-300">
                    <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                </div>
                @if($product->original_price)
                    <span class="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">SALE</span>
                @endif
            </div>

            
            <div class="flex flex-col">
                @if($product->category)
                    <p class="text-sm text-blue-600 font-semibold uppercase tracking-wider mb-2">{{ $product->category->name }}</p>
                @endif

                <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{{ $product->name }}</h1>

                
                <div class="flex items-center gap-3 mb-6">
                    <span class="text-3xl font-bold text-gray-900">${{ number_format($product->price, 2) }}</span>
                    @if($product->original_price)
                        <span class="text-xl text-gray-400 line-through">${{ number_format($product->original_price, 2) }}</span>
                        <span class="text-sm font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                            -{{ round((1 - $product->price / $product->original_price) * 100) }}%
                        </span>
                    @endif
                </div>

                
                <div class="flex items-center gap-2 mb-6">
                    @if($product->has_stock)
                        <span class="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                        <span class="text-sm text-green-600 font-medium">In Stock ({{ $product->stock }} available)</span>
                    @else
                        <span class="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                        <span class="text-sm text-red-600 font-medium">Out of Stock</span>
                    @endif
                </div>

                
                <div class="mb-8">
                    <h3 class="font-semibold text-gray-900 mb-2">Description</h3>
                    <p class="text-gray-600 leading-relaxed">{{ $product->description }}</p>
                </div>

                
                @if($product->sku)
                    <p class="text-sm text-gray-400 mb-4">SKU: {{ $product->sku }}</p>
                @endif

                
                <div class="mt-auto pt-6 border-t border-gray-200">
                    <button type="button"
                            class="btn btn-primary w-full py-3 text-base {{ !$product->has_stock ? 'opacity-50 cursor-not-allowed' : '' }}"
                            {{ !$product->has_stock ? 'disabled' : '' }}>
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
                        </svg>
                        {{ $product->has_stock ? 'Add to Cart' : 'Out of Stock' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</section>


@if($relatedProducts->isNotEmpty())
<section class="py-12 bg-white border-t border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            @foreach($relatedProducts as $related)
                <a href="{{ route('products.show', $related) }}" class="product-card group">
                    <div class="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                        <div class="absolute inset-0 flex items-center justify-center text-gray-400">
                            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{{ $related->name }}</h3>
                        <div class="mt-1">
                            <span class="text-lg font-bold text-gray-900">${{ number_format($related->price, 2) }}</span>
                        </div>
                    </div>
                </a>
            @endforeach
        </div>
    </div>
</section>
@endif


<footer class="bg-gray-900 text-gray-300 py-8">
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
