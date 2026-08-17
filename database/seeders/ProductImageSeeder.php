<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductImageSeeder extends Seeder
{
    private const IMAGE_VARIANTS = 5;

    /**
     * Apply locally stored category images to existing products without deleting
     * products, users, carts, wishlists, orders, reviews, or category records.
     */
    public function run(): void
    {
        $updated = 0;

        Product::query()
            ->with('category')
            ->orderBy('category_id')
            ->orderBy('id')
            ->get()
            ->groupBy('category_id')
            ->each(function ($products) use (&$updated) {
                $categorySlug = $products->first()?->category?->slug;

                if (! $categorySlug) {
                    return;
                }

                $products->values()->each(function (Product $product, int $index) use ($categorySlug, &$updated) {
                    $primaryNumber = ($index % self::IMAGE_VARIANTS) + 1;
                    $secondaryNumber = (($index + 1) % self::IMAGE_VARIANTS) + 1;
                    $primaryImage = "images/categories/{$categorySlug}-{$primaryNumber}.jpg";
                    $secondaryImage = "images/categories/{$categorySlug}-{$secondaryNumber}.jpg";

                    $product->update([
                        'image' => $primaryImage,
                        'images' => [$primaryImage, $secondaryImage],
                    ]);

                    $updated++;
                });
            });

        $this->command->info("{$updated} product images updated from local category assets.");
    }
}
