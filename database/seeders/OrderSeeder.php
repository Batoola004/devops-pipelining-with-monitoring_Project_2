<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('email', '!=', 'admin@fiberroad.com')->get();
        if ($users->isEmpty()) {
            $users = User::factory(5)->create();
        }

        $products = Product::inRandomOrder()->limit(20)->get();
        if ($products->isEmpty()) {
            $this->command->warn('No products found. Run ProductSeeder first.');
            return;
        }

        foreach ($users as $user) {
            $address = Address::factory()->create([
                'user_id' => $user->id,
                'is_default' => true,
            ]);

            $orderCount = rand(1, 4);
            for ($i = 0; $i < $orderCount; $i++) {
                $itemCount = rand(1, 4);
                $selectedProducts = $products->random(min($itemCount, $products->count()));
                $subtotal = 0;
                $items = [];

                foreach ($selectedProducts as $product) {
                    $qty = rand(1, 3);
                    $subtotal += $product->price * $qty;
                    $items[] = [
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'product_image' => $product->image,
                        'price' => $product->price,
                        'quantity' => $qty,
                    ];
                }

                $shipping = 10.00;
                $tax = round($subtotal * 0.08, 2);
                $total = round($subtotal + $shipping + $tax, 2);

                $statuses = ['pending', 'processing', 'shipped', 'delivered'];
                $paymentStatuses = ['pending', 'paid'];

                $order = Order::create([
                    'user_id' => $user->id,
                    'order_number' => 'FR-' . strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 8)),
                    'status' => $statuses[array_rand($statuses)],
                    'subtotal' => $subtotal,
                    'shipping' => $shipping,
                    'tax' => $tax,
                    'total' => $total,
                    'shipping_address_id' => $address->id,
                    'payment_method' => ['credit_card', 'paypal', 'stripe'][array_rand(['credit_card', 'paypal', 'stripe'])],
                    'payment_status' => $paymentStatuses[array_rand($paymentStatuses)],
                ]);

                foreach ($items as $item) {
                    $order->items()->create($item);
                }
            }
        }

        $totalOrders = Order::count();
        $totalItems = OrderItem::count();
        $this->command->info("{$totalOrders} orders with {$totalItems} items seeded!");
    }
}
