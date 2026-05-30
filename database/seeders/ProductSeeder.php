<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🛍️ Seeding products...');

        $categoryIds = Category::pluck('id')->toArray();

        // Featured products
        Product::factory()
            ->count(8)
            ->featured()
            ->create();

        // Cheap products across categories
        foreach ($categoryIds as $catId) {
            Product::factory()
                ->count(3)
                ->cheap()
                ->forCategory($catId)
                ->create();
        }

        // Mid-range products
        Product::factory()
            ->count(20)
            ->midRange()
            ->create();

        // Expensive products
        Product::factory()
            ->count(10)
            ->expensive()
            ->create();

        // Some out of stock products
        Product::factory()
            ->count(5)
            ->outOfStock()
            ->create();

        $this->command->info('✅ Products seeded successfully!');
    }
}
