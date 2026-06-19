<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    private const PRODUCTS = [
        'laptops-computers' => [
            ['name' => 'UltraBook Pro 15"', 'price' => 1299.99, 'original_price' => 1499.99, 'featured' => true, 'stock' => 25],
            ['name' => 'Business Laptop 14"', 'price' => 899.99, 'featured' => true, 'stock' => 40],
            ['name' => 'Gaming Laptop RTX 4070', 'price' => 1799.99, 'original_price' => 1999.99, 'featured' => true, 'stock' => 15],
            ['name' => 'Mini PC Desktop', 'price' => 499.99, 'stock' => 30],
            ['name' => 'All-in-One Desktop 27"', 'price' => 1399.99, 'featured' => true, 'stock' => 20],
            ['name' => 'Chromebook 14"', 'price' => 349.99, 'stock' => 50],
        ],
        'smartphones-tablets' => [
            ['name' => 'Flagship Smartphone 256GB', 'price' => 999.99, 'original_price' => 1099.99, 'featured' => true, 'stock' => 35],
            ['name' => 'Mid-Range Phone 128GB', 'price' => 449.99, 'featured' => true, 'stock' => 60],
            ['name' => 'iPad Pro 12.9"', 'price' => 1099.99, 'featured' => true, 'stock' => 20],
            ['name' => 'Android Tablet 10"', 'price' => 299.99, 'stock' => 45],
            ['name' => 'E-Reader with Backlight', 'price' => 149.99, 'stock' => 80],
        ],
        'headphones-audio' => [
            ['name' => 'Wireless Noise-Canceling Headphones', 'price' => 349.99, 'original_price' => 399.99, 'featured' => true, 'stock' => 30],
            ['name' => 'True Wireless Earbuds', 'price' => 179.99, 'featured' => true, 'stock' => 55],
            ['name' => 'Over-Ear Studio Headphones', 'price' => 249.99, 'stock' => 25],
            ['name' => 'Portable Bluetooth Speaker', 'price' => 79.99, 'stock' => 70],
            ['name' => 'Soundbar with Subwoofer', 'price' => 299.99, 'featured' => true, 'stock' => 20],
            ['name' => 'USB Microphone for Streaming', 'price' => 129.99, 'stock' => 35],
        ],
        'cables-adapters' => [
            ['name' => 'USB-C to HDMI Cable 6ft', 'price' => 19.99, 'stock' => 150],
            ['name' => 'Thunderbolt 4 Cable', 'price' => 39.99, 'stock' => 80],
            ['name' => 'Ethernet Cable Cat6 10ft', 'price' => 12.99, 'stock' => 200],
            ['name' => 'USB-C Hub 7-in-1', 'price' => 44.99, 'featured' => true, 'stock' => 65],
            ['name' => 'DisplayPort to HDMI Adapter', 'price' => 14.99, 'stock' => 90],
            ['name' => '3.5mm Audio Extension Cable', 'price' => 8.99, 'stock' => 120],
        ],
        'chargers-power' => [
            ['name' => '65W GaN USB-C Charger', 'price' => 49.99, 'featured' => true, 'stock' => 60],
            ['name' => '100W USB-C Cable Braided', 'price' => 24.99, 'stock' => 100],
            ['name' => 'Portable Power Bank 20000mAh', 'price' => 59.99, 'original_price' => 69.99, 'featured' => true, 'stock' => 45],
            ['name' => 'Wireless Charging Pad', 'price' => 29.99, 'stock' => 80],
            ['name' => 'Car Charger USB-C 45W', 'price' => 19.99, 'stock' => 110],
            ['name' => 'Multi-Port Charging Station', 'price' => 39.99, 'stock' => 50],
        ],
        'keyboards-mice' => [
            ['name' => 'Mechanical Gaming Keyboard RGB', 'price' => 149.99, 'featured' => true, 'stock' => 35],
            ['name' => 'Wireless Ergonomic Mouse', 'price' => 79.99, 'stock' => 45],
            ['name' => 'Compact 60% Keyboard', 'price' => 89.99, 'featured' => true, 'stock' => 40],
            ['name' => 'Vertical Ergonomic Mouse', 'price' => 49.99, 'stock' => 55],
            ['name' => 'Keyboard Wrist Rest', 'price' => 24.99, 'stock' => 70],
            ['name' => 'Gaming Mouse Pad Extended', 'price' => 34.99, 'stock' => 85],
        ],
        'monitors-displays' => [
            ['name' => '27" 4K IPS Monitor', 'price' => 449.99, 'original_price' => 499.99, 'featured' => true, 'stock' => 25],
            ['name' => '34" UltraWide Curved Monitor', 'price' => 699.99, 'featured' => true, 'stock' => 15],
            ['name' => '24" 165Hz Gaming Monitor', 'price' => 299.99, 'stock' => 30],
            ['name' => 'Portable USB-C Monitor 15"', 'price' => 249.99, 'stock' => 20],
            ['name' => 'Monitor Arm Mount', 'price' => 59.99, 'stock' => 40],
        ],
        'storage-drives' => [
            ['name' => '1TB NVMe SSD', 'price' => 119.99, 'featured' => true, 'stock' => 60],
            ['name' => '2TB External SSD', 'price' => 179.99, 'featured' => true, 'stock' => 35],
            ['name' => '4TB External HDD', 'price' => 109.99, 'stock' => 40],
            ['name' => '512GB USB-C Flash Drive', 'price' => 49.99, 'stock' => 75],
            ['name' => 'NAS 2-Bay Enclosure', 'price' => 199.99, 'stock' => 15],
            ['name' => 'SD Card 256GB', 'price' => 34.99, 'stock' => 100],
        ],
        'smart-home' => [
            ['name' => 'Smart Thermostat', 'price' => 129.99, 'featured' => true, 'stock' => 30],
            ['name' => 'WiFi Smart Bulb 4-Pack', 'price' => 49.99, 'stock' => 80],
            ['name' => 'Smart Plug 4-Pack', 'price' => 39.99, 'stock' => 90],
            ['name' => 'Video Doorbell', 'price' => 199.99, 'featured' => true, 'stock' => 25],
            ['name' => 'Smart Security Camera', 'price' => 89.99, 'stock' => 40],
            ['name' => 'Smart Lock', 'price' => 249.99, 'stock' => 20],
        ],
        'wearables' => [
            ['name' => 'Smart Watch GPS', 'price' => 399.99, 'featured' => true, 'stock' => 30],
            ['name' => 'Fitness Tracker', 'price' => 149.99, 'featured' => true, 'stock' => 55],
            ['name' => 'Wireless Earbuds with ANC', 'price' => 199.99, 'original_price' => 249.99, 'stock' => 40],
            ['name' => 'Smart Ring', 'price' => 299.99, 'stock' => 20],
            ['name' => 'GPS Running Watch', 'price' => 249.99, 'stock' => 25],
        ],
        'gaming' => [
            ['name' => 'Xbox Wireless Controller', 'price' => 64.99, 'featured' => true, 'stock' => 50],
            ['name' => 'Gaming Headset 7.1 Surround', 'price' => 129.99, 'stock' => 35],
            ['name' => 'RGB Gaming Mouse', 'price' => 79.99, 'featured' => true, 'stock' => 45],
            ['name' => 'Gaming Chair', 'price' => 399.99, 'original_price' => 499.99, 'featured' => true, 'stock' => 15],
            ['name' => 'Capture Card 4K', 'price' => 179.99, 'stock' => 25],
            ['name' => 'Controller Charging Station', 'price' => 29.99, 'stock' => 60],
            ['name' => 'VR Headset', 'price' => 499.99, 'featured' => true, 'stock' => 10],
        ],
        'networking' => [
            ['name' => 'WiFi 6 Router', 'price' => 199.99, 'featured' => true, 'stock' => 30],
            ['name' => 'WiFi 6 Mesh System 3-Pack', 'price' => 349.99, 'featured' => true, 'stock' => 20],
            ['name' => 'Network Switch 8-Port', 'price' => 49.99, 'stock' => 40],
            ['name' => 'Powerline Adapter Kit', 'price' => 69.99, 'stock' => 35],
            ['name' => 'WiFi Range Extender', 'price' => 39.99, 'stock' => 55],
            ['name' => 'USB WiFi Adapter', 'price' => 24.99, 'stock' => 70],
        ],
    ];

    public function run(): void
    {
        Product::query()->delete();

        $categories = Category::pluck('id', 'slug');

        $total = 0;
        foreach (self::PRODUCTS as $slug => $products) {
            $categoryId = $categories[$slug] ?? null;
            if (!$categoryId) continue;

            foreach ($products as $data) {
                $prodSlug = Str::slug($data['name']);
                Product::create([
                    'name' => $data['name'],
                    'slug' => $prodSlug,
                    'description' => "Premium {$data['name']} — engineered for performance and reliability. Perfect for everyday use, this item combines cutting-edge technology with sleek design. Order now and experience the FiberRoad difference.",
                    'price' => $data['price'],
                    'original_price' => $data['original_price'] ?? null,
                    'image' => 'https://picsum.photos/seed/prod-' . $prodSlug . '/640/480',
                    'images' => json_encode([
                        'https://picsum.photos/seed/prod-' . $prodSlug . '-1/640/480',
                        'https://picsum.photos/seed/prod-' . $prodSlug . '-2/640/480',
                    ]),
                    'category_id' => $categoryId,
                    'is_active' => true,
                    'featured' => $data['featured'] ?? false,
                    'stock' => $data['stock'] ?? rand(10, 50),
                    'sku' => 'FR-' . strtoupper(Str::random(8)),
                ]);
                $total++;
            }
        }

        $this->command->info("{$total} electronics products seeded!");
    }
}
