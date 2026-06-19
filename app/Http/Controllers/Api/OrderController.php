<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orders = Order::where('user_id', auth()->id())
            ->withCount('items')
            ->latest()
            ->paginate(min($request->per_page ?? 10, 50));

        return response()->json($orders);
    }

    public function show(Order $order): JsonResponse
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->load('items');

        return response()->json(['order' => $order]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'shipping_address_id' => 'integer|exists:addresses,id',
            'shipping_address' => 'required_without:shipping_address_id|array',
            'shipping_address.full_name' => 'required_with:shipping_address|string',
            'shipping_address.phone' => 'required_with:shipping_address|string',
            'shipping_address.line1' => 'required_with:shipping_address|string',
            'shipping_address.city' => 'required_with:shipping_address|string',
            'shipping_address.state' => 'required_with:shipping_address|string',
            'shipping_address.zip' => 'required_with:shipping_address|string',
            'payment_method' => 'required|in:stripe,cod',
            'notes' => 'nullable|string',
        ]);

        $cartItems = CartItem::where('user_id', auth()->id())
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 409);
        }

        $subtotal = (float) $cartItems->sum(fn($i) => $i->product->price * $i->quantity);

        $order = Order::create([
            'user_id' => auth()->id(),
            'order_number' => 'FR-' . strtoupper(Str::random(10)),
            'status' => 'pending',
            'subtotal' => $subtotal,
            'shipping' => $subtotal >= 50 ? 0 : 9.99,
            'tax' => round($subtotal * 0.08, 2),
            'total' => $subtotal + ($subtotal >= 50 ? 0 : 9.99) + round($subtotal * 0.08, 2),
            'shipping_address_id' => $validated['shipping_address_id'] ?? null,
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'pending',
            'notes' => $validated['notes'] ?? null,
        ]);

        foreach ($cartItems as $cartItem) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $cartItem->product_id,
                'product_name' => $cartItem->product->name,
                'product_image' => $cartItem->product->image,
                'price' => $cartItem->product->price,
                'quantity' => $cartItem->quantity,
            ]);

            $cartItem->product->decrement('stock', $cartItem->quantity);
        }

        CartItem::where('user_id', auth()->id())->delete();

        $order->load('items');

        if (!$request->user('web')) {
            auth()->login($request->user());
        }

        return response()->json([
            'order' => $order,
            'message' => 'Order placed successfully',
        ], 201);
    }
}
