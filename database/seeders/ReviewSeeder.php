<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('email', '!=', 'admin@fiberroad.com')->get();
        if ($users->isEmpty()) {
            $users = User::factory(5)->create();
        }

        $products = Product::all();
        if ($products->isEmpty()) {
            $this->command->warn('No products found. Run ProductSeeder first.');
            return;
        }

        $titles = [
            'Great product!', 'Highly recommend', 'Good value for money',
            'Exceeded expectations', 'Solid quality', 'Works perfectly',
            'Decent but not amazing', 'Exactly as described', 'Love it!',
            'Perfect for my needs', 'Best in class', 'Really impressed',
            'Good build quality', 'Fast shipping', 'Amazing quality',
        ];

        $bodies = [
            'I have been using this for a few weeks now and it is fantastic. Works exactly as expected and the quality is top-notch.',
            'This product exceeded my expectations. The build quality is excellent and it performs flawlessly. Highly recommended!',
            'Great product for the price. Does everything I need it to do. Would definitely buy again.',
            'Solid product, fast delivery. Packaged well and arrived in perfect condition. Very happy with my purchase.',
            'Really impressed with the quality. It feels premium and works great. Shipping was fast too.',
            'Good product overall. There are a few minor things I would improve, but for the price it is hard to beat.',
            'Exactly what I was looking for. Fits perfectly and works great. Would recommend to anyone.',
            'I am very satisfied with this purchase. It works perfectly and the quality is excellent.',
            'This is my second purchase of this product. It is reliable and well-made. Five stars!',
            'Excellent build quality and great performance. Very happy with this purchase.',
        ];

        foreach ($products as $product) {
            $reviewCount = rand(1, 5);
            $reviewUsers = $users->random(min($reviewCount, $users->count()));

            foreach ($reviewUsers as $user) {
                $exists = Review::where('user_id', $user->id)
                    ->where('product_id', $product->id)
                    ->exists();

                if (!$exists) {
                    Review::create([
                        'user_id' => $user->id,
                        'product_id' => $product->id,
                        'rating' => rand(3, 5),
                        'title' => $titles[array_rand($titles)],
                        'body' => $bodies[array_rand($bodies)],
                        'is_approved' => true,
                    ]);
                }
            }
        }

        $this->command->info(Review::count() . ' reviews seeded!');
    }
}
