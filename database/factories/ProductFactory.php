<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->sentence(3);
        $price = $this->faker->randomFloat(2, 10, 500);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $this->faker->paragraphs(3, true),
            'price' => $price,
            'original_price' => $this->faker->boolean(30) ? $price * 1.3 : null,
            'image' => 'https://picsum.photos/seed/prod-' . Str::slug($name) . '/640/480',
            'images' => [
                'https://picsum.photos/seed/prod-' . Str::slug($name) . '-1/640/480',
                'https://picsum.photos/seed/prod-' . Str::slug($name) . '-2/640/480',
                'https://picsum.photos/seed/prod-' . Str::slug($name) . '-3/640/480',
            ],
            'category_id' => Category::inRandomOrder()->first()?->id ?? Category::factory(),
            'is_active' => true,
            'featured' => $this->faker->boolean(20),
            'stock' => $this->faker->numberBetween(0, 100),
            'sku' => strtoupper(Str::random(10)),
        ];
    }

    public function cheap(): static
    {
        return $this->state(fn() => ['price' => $this->faker->randomFloat(2, 5, 30)]);
    }

    public function midRange(): static
    {
        return $this->state(fn() => ['price' => $this->faker->randomFloat(2, 30, 100)]);
    }

    public function expensive(): static
    {
        return $this->state(fn() => ['price' => $this->faker->randomFloat(2, 100, 500)]);
    }

    public function featured(): static
    {
        return $this->state(fn() => ['featured' => true]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn() => ['stock' => 0]);
    }

    public function forCategory(int $categoryId): static
    {
        return $this->state(fn() => ['category_id' => $categoryId]);
    }
}
