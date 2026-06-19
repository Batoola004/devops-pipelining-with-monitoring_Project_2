<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        Category::query()->delete();

        $categories = [
            ['name' => 'Laptops & Computers', 'sort_order' => 1],
            ['name' => 'Smartphones & Tablets', 'sort_order' => 2],
            ['name' => 'Headphones & Audio', 'sort_order' => 3],
            ['name' => 'Cables & Adapters', 'sort_order' => 4],
            ['name' => 'Chargers & Power', 'sort_order' => 5],
            ['name' => 'Keyboards & Mice', 'sort_order' => 6],
            ['name' => 'Monitors & Displays', 'sort_order' => 7],
            ['name' => 'Storage & Drives', 'sort_order' => 8],
            ['name' => 'Smart Home', 'sort_order' => 9],
            ['name' => 'Wearables', 'sort_order' => 10],
            ['name' => 'Gaming', 'sort_order' => 11],
            ['name' => 'Networking', 'sort_order' => 12],
        ];

        foreach ($categories as $data) {
            $slug = Str::slug($data['name']);
            Category::create([
                'name' => $data['name'],
                'slug' => $slug,
                'description' => "Browse our collection of {$data['name']}",
                'image' => 'https://picsum.photos/seed/cat-' . $slug . '/640/480',
                'is_active' => true,
                'sort_order' => $data['sort_order'],
            ]);
        }

        $this->command->info('12 electronics categories seeded!');
    }
}
