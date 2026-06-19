<?php

namespace Database\Seeders;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class CartSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('email', '!=', 'admin@fiberroad.com')->get();
        if ($users->isEmpty()) {
            $users = User::factory(5)->create();
        }

        $products = Product::inRandomOrder()->get();
        if ($products->isEmpty()) {
            $this->command->warn('No products found. Run ProductSeeder first.');
            return;
        }

        foreach ($users as $user) {
            $cartCount = rand(1, 4);
            $selectedProducts = $products->random(min($cartCount, $products->count()));

            foreach ($selectedProducts as $product) {
                CartItem::updateOrCreate(
                    ['user_id' => $user->id, 'product_id' => $product->id],
                    ['quantity' => rand(1, 3)]
                );
            }
        }

        $this->command->info(CartItem::count() . ' cart items seeded!');
    }
}
