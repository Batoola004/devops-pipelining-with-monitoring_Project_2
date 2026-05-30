<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Electronics', 'description' => 'Latest gadgets and electronics', 'sort_order' => 1],
            ['name' => 'Clothing', 'description' => 'Fashionable clothing for all', 'sort_order' => 2],
            ['name' => 'Home & Garden', 'description' => 'Everything for your home', 'sort_order' => 3],
            ['name' => 'Sports', 'description' => 'Sports equipment and gear', 'sort_order' => 4],
            ['name' => 'Books', 'description' => 'Books for every reader', 'sort_order' => 5],
            ['name' => 'Toys & Games', 'description' => 'Fun for all ages', 'sort_order' => 6],
            ['name' => 'Beauty', 'description' => 'Beauty and personal care', 'sort_order' => 7],
            ['name' => 'Automotive', 'description' => 'Car parts and accessories', 'sort_order' => 8],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => $category['description'],
                'image' => 'categories/' . Str::slug($category['name']) . '.jpg',
                'is_active' => true,
                'sort_order' => $category['sort_order'],
            ]);
        }

        $this->command->info('✅ Categories seeded successfully!');
    }
}
