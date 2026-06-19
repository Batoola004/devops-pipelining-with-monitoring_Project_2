<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Database\Seeder;

class WishlistSeeder extends Seeder
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
            $wishlistCount = rand(2, 6);
            $selectedProducts = $products->random(min($wishlistCount, $products->count()));

            foreach ($selectedProducts as $product) {
                Wishlist::firstOrCreate([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                ]);
            }
        }

        $this->command->info(Wishlist::count() . ' wishlist items seeded!');
    }
}
