<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        $subtotal = $this->faker->randomFloat(2, 50, 1000);
        $shipping = 10.00;
        $tax = round($subtotal * 0.08, 2);

        return [
            'user_id' => User::factory(),
            'order_number' => 'FR-' . strtoupper(Str::random(8)),
            'status' => $this->faker->randomElement(['pending', 'processing', 'shipped', 'delivered']),
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'tax' => $tax,
            'total' => round($subtotal + $shipping + $tax, 2),
            'shipping_address_id' => null,
            'payment_method' => $this->faker->randomElement(['credit_card', 'paypal', 'stripe']),
            'payment_status' => $this->faker->randomElement(['pending', 'paid']),
            'notes' => $this->faker->boolean(30) ? $this->faker->sentence() : null,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn () => [
            'status' => 'pending',
            'payment_status' => 'pending',
        ]);
    }

    public function paid(): static
    {
        return $this->state(fn () => ['payment_status' => 'paid']);
    }

    public function shipped(): static
    {
        return $this->state(fn () => ['status' => 'shipped']);
    }

    public function delivered(): static
    {
        return $this->state(fn () => ['status' => 'delivered']);
    }

    public function cancelled(): static
    {
        return $this->state(fn () => [
            'status' => 'cancelled',
            'payment_status' => 'refunded',
        ]);
    }
}
