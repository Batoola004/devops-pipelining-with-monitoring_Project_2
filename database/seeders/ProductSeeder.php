<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🛍️ Seeding products...');

        $categories = Category::pluck('id', 'slug')->toArray();

        // Product data organized by category
        $productsByCategory = [
            'electronics' => [
                ['name' => 'Wireless Bluetooth Headphones', 'price' => 79.99, 'original_price' => 99.99, 'featured' => true, 'stock' => 45],
                ['name' => 'USB-C Hub 7-in-1 Adapter', 'price' => 34.99, 'featured' => true, 'stock' => 120],
                ['name' => 'Portable Power Bank 20000mAh', 'price' => 49.99, 'original_price' => 59.99, 'featured' => true, 'stock' => 80],
                ['name' => 'Smart LED Light Bulb', 'price' => 19.99, 'stock' => 200],
                ['name' => 'Mechanical Gaming Keyboard', 'price' => 89.99, 'featured' => true, 'stock' => 35],
                ['name' => 'Wireless Charging Pad', 'price' => 24.99, 'stock' => 150],
                ['name' => 'HDMI to DisplayPort Cable', 'price' => 14.99, 'stock' => 90],
                ['name' => 'Webcam 1080p with Microphone', 'price' => 59.99, 'original_price' => 69.99, 'stock' => 65],
                ['name' => 'Ergonomic Mouse Pad', 'price' => 12.99, 'stock' => 180],
                ['name' => 'Laptop Stand Adjustable', 'price' => 39.99, 'featured' => true, 'stock' => 55],
                ['name' => 'Noise Canceling Earbuds', 'price' => 129.99, 'stock' => 30],
                ['name' => 'Smartphone Tripod', 'price' => 22.99, 'stock' => 75],
            ],
            'clothing' => [
                ['name' => 'Classic Fit Cotton T-Shirt', 'price' => 24.99, 'featured' => true, 'stock' => 200],
                ['name' => 'Slim Fit Denim Jeans', 'price' => 54.99, 'original_price' => 69.99, 'featured' => true, 'stock' => 85],
                ['name' => 'Wool Blend Sweater', 'price' => 64.99, 'stock' => 40],
                ['name' => 'Waterproof Rain Jacket', 'price' => 89.99, 'featured' => true, 'stock' => 55],
                ['name' => 'Casual Canvas Sneakers', 'price' => 44.99, 'stock' => 90],
                ['name' => 'Leather Belt', 'price' => 29.99, 'stock' => 120],
                ['name' => 'Running Shorts', 'price' => 19.99, 'stock' => 150],
                ['name' => 'Formal Dress Shirt', 'price' => 39.99, 'original_price' => 49.99, 'stock' => 60],
                ['name' => 'Cashmere Scarf', 'price' => 34.99, 'stock' => 35],
                ['name' => 'Cotton Pajama Set', 'price' => 42.99, 'stock' => 45],
                ['name' => 'Lightweight Summer Dress', 'price' => 49.99, 'featured' => true, 'stock' => 70],
                ['name' => 'Wool Beanie Hat', 'price' => 14.99, 'stock' => 100],
            ],
            'home-garden' => [
                ['name' => 'Indoor Succulent Planter Set', 'price' => 29.99, 'featured' => true, 'stock' => 60],
                ['name' => 'Scented Soy Candle Collection', 'price' => 24.99, 'stock' => 85],
                ['name' => 'Bamboo Cutting Board', 'price' => 18.99, 'stock' => 110],
                ['name' => 'Memory Foam Bath Mat', 'price' => 22.99, 'stock' => 70],
                ['name' => 'Decorative Throw Pillow', 'price' => 15.99, 'stock' => 95],
                ['name' => 'Stainless Steel Watering Can', 'price' => 26.99, 'stock' => 40],
                ['name' => 'LED Vanity Mirror', 'price' => 44.99, 'original_price' => 54.99, 'stock' => 35],
                ['name' => 'Plant Stand Wooden', 'price' => 34.99, 'featured' => true, 'stock' => 45],
            ],
            'sports' => [
                ['name' => 'Yoga Mat Premium', 'price' => 32.99, 'featured' => true, 'stock' => 65],
                ['name' => 'Resistance Bands Set', 'price' => 18.99, 'stock' => 120],
                ['name' => 'Adjustable Dumbbells Pair', 'price' => 149.99, 'original_price' => 179.99, 'featured' => true, 'stock' => 20],
                ['name' => 'Insulated Water Bottle', 'price' => 22.99, 'stock' => 150],
                ['name' => 'Jump Rope Speed Cable', 'price' => 11.99, 'stock' => 90],
                ['name' => 'Foam Roller for Muscle Recovery', 'price' => 19.99, 'stock' => 55],
                ['name' => 'Gym Duffle Bag', 'price' => 39.99, 'featured' => true, 'stock' => 40],
                ['name' => 'Pilates Ring', 'price' => 14.99, 'stock' => 70],
            ],
            'books' => [
                ['name' => 'The Art of Clean Code', 'price' => 29.99, 'original_price' => 34.99, 'featured' => true, 'stock' => 100],
                ['name' => 'Designing Data-Intensive Applications', 'price' => 44.99, 'featured' => true, 'stock' => 45],
                ['name' => 'Atomic Habits', 'price' => 16.99, 'stock' => 200],
                ['name' => 'The Pragmatic Programmer', 'price' => 39.99, 'stock' => 80],
                ['name' => 'System Design Interview Guide', 'price' => 34.99, 'stock' => 55],
                ['name' => 'Deep Work', 'price' => 14.99, 'stock' => 120],
            ],
            'toys-games' => [
                ['name' => 'Wooden Building Blocks Set', 'price' => 29.99, 'featured' => true, 'stock' => 60],
                ['name' => 'Strategy Board Game', 'price' => 34.99, 'stock' => 40],
                ['name' => 'Remote Control Car', 'price' => 24.99, 'original_price' => 29.99, 'stock' => 35],
                ['name' => 'Puzzle 1000 Pieces', 'price' => 19.99, 'stock' => 50],
                ['name' => 'Card Game Collection', 'price' => 12.99, 'stock' => 80],
                ['name' => 'Science Experiment Kit', 'price' => 27.99, 'stock' => 25],
                ['name' => 'Plush Teddy Bear', 'price' => 22.99, 'featured' => true, 'stock' => 65],
            ],
            'beauty' => [
                ['name' => 'Organic Face Serum', 'price' => 28.99, 'stock' => 75],
                ['name' => 'Essential Oil Diffuser', 'price' => 32.99, 'featured' => true, 'stock' => 40],
                ['name' => 'Natural Lip Balm Set', 'price' => 12.99, 'stock' => 150],
                ['name' => 'Bamboo Hair Brush', 'price' => 14.99, 'stock' => 90],
                ['name' => 'Moisturizing Face Mask', 'price' => 18.99, 'stock' => 110],
                ['name' => 'Vitamin C Brightening Cream', 'price' => 24.99, 'original_price' => 29.99, 'featured' => true, 'stock' => 55],
                ['name' => 'Sunscreen SPF 50', 'price' => 16.99, 'stock' => 80],
            ],
            'automotive' => [
                ['name' => 'Car Phone Mount', 'price' => 19.99, 'featured' => true, 'stock' => 100],
                ['name' => 'Microfiber Cleaning Cloth Set', 'price' => 9.99, 'stock' => 200],
                ['name' => 'Dashboard Camera 4K', 'price' => 89.99, 'original_price' => 109.99, 'stock' => 30],
                ['name' => 'Car Seat Organizer', 'price' => 24.99, 'stock' => 55],
                ['name' => 'Tire Pressure Gauge', 'price' => 14.99, 'stock' => 70],
                ['name' => 'USB Car Charger', 'price' => 12.99, 'stock' => 120],
                ['name' => 'Emergency Roadside Kit', 'price' => 34.99, 'featured' => true, 'stock' => 45],
                ['name' => 'Car Air Freshener Pack', 'price' => 8.99, 'stock' => 180],
            ],
        ];

        $totalProducts = 0;

        foreach ($productsByCategory as $slug => $products) {
            $categoryId = $categories[$slug] ?? null;

            if (! $categoryId) {
                continue;
            }

            foreach ($products as $index => $productData) {
                Product::create([
                    'name' => $productData['name'],
                    'slug' => Str::slug($productData['name']),
                    'description' => "Premium {$productData['name']} — crafted for quality and durability. " .
                        "Perfect for everyday use, this item combines style with functionality. " .
                        "Order now and experience the FiberRoad difference.",
                    'price' => $productData['price'],
                    'original_price' => $productData['original_price'] ?? null,
                    'image' => 'products/' . Str::slug($productData['name']) . '.jpg',
                    'images' => json_encode([
                        'products/' . Str::slug($productData['name']) . '-1.jpg',
                        'products/' . Str::slug($productData['name']) . '-2.jpg',
                    ]),
                    'category_id' => $categoryId,
                    'is_active' => true,
                    'featured' => $productData['featured'] ?? false,
                    'stock' => $productData['stock'] ?? rand(10, 100),
                    'sku' => 'FR-' . strtoupper(Str::random(8)),
                ]);

                $totalProducts++;
            }
        }

        $this->command->info("✅ {$totalProducts} products seeded successfully!");
    }
}
