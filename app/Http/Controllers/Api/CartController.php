<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(): JsonResponse
    {
        $items = CartItem::where('user_id', auth()->id())
            ->with('product.category')
            ->latest()
            ->get();

        return response()->json([
            'items' => $items->map(fn($item) => $this->formatItem($item)),
            'summary' => [
                'item_count' => $items->sum('quantity'),
                'subtotal' => (float) $items->sum(fn($i) => $i->product->price * $i->quantity),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'integer|min:1|max:99',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        if ($product->stock < ($validated['quantity'] ?? 1)) {
            return response()->json(['message' => 'Not enough stock'], 409);
        }

        $existing = CartItem::where('user_id', auth()->id())
            ->where('product_id', $product->id)
            ->first();

        if ($existing) {
            $existing->increment('quantity', $validated['quantity'] ?? 1);
        } else {
            CartItem::create([
                'user_id' => auth()->id(),
                'product_id' => $product->id,
                'quantity' => $validated['quantity'] ?? 1,
            ]);
        }

        return $this->index()->setStatusCode(201);
    }

    public function update(Request $request, CartItem $cartItem): JsonResponse
    {
        if ($cartItem->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate(['quantity' => 'required|integer|min:1|max:99']);

        if ($cartItem->product->stock < $validated['quantity']) {
            return response()->json(['message' => 'Not enough stock'], 409);
        }

        $cartItem->update(['quantity' => $validated['quantity']]);

        return $this->index();
    }

    public function destroy(CartItem $cartItem): JsonResponse
    {
        if ($cartItem->user_id !== auth()->id()) {
            abort(403);
        }

        $cartItem->delete();

        return $this->index();
    }

    public function clear(): JsonResponse
    {
        CartItem::where('user_id', auth()->id())->delete();

        return response()->json(['message' => 'Cart cleared']);
    }

    private function formatItem($item): array
    {
        return [
            'id' => $item->id,
            'product_id' => $item->product_id,
            'quantity' => $item->quantity,
            'product' => [
                'id' => $item->product->id,
                'name' => $item->product->name,
                'slug' => $item->product->slug,
                'price' => (float) $item->product->price,
                'original_price' => $item->product->original_price ? (float) $item->product->original_price : null,
                'image_url' => $item->product->image_url,
                'has_stock' => $item->product->has_stock,
            ],
        ];
    }
}
