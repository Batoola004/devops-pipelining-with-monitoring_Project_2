<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'original_price',
        'image',
        'images',
        'category_id',
        'is_active',
        'featured',
        'stock',
        'sku',
    ];

    protected $appends = [
        'has_stock',
        'image_url',
        'images_urls',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'is_active' => 'boolean',
        'featured' => 'boolean',
        'stock' => 'integer',
        'images' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function getHasStockAttribute()
    {
        return $this->stock > 0;
    }

    public function getImageUrlAttribute()
    {
        return $this->resolveImageUrl($this->image);
    }

    public function getImagesUrlsAttribute()
    {
        $images = $this->images;

        if (is_string($images)) {
            $decoded = json_decode($images, true);
            $images = is_array($decoded) ? $decoded : [$images];
        }

        if (! is_array($images)) {
            return [];
        }

        return collect($images)
            ->map(fn ($image) => $this->resolveImageUrl($image))
            ->filter()
            ->values()
            ->all();
    }

    /**
     * Resolve either an external URL, a versioned public asset, or a Laravel
     * storage path without accidentally prefixing an external URL with /storage.
     */
    protected function resolveImageUrl(?string $image): ?string
    {
        if (blank($image)) {
            return null;
        }

        if (Str::startsWith($image, ['http://', 'https://', '//'])) {
            return $image;
        }

        if (Str::startsWith($image, 'images/')) {
            return '/' . ltrim($image, '/');
        }

        return '/storage/' . ltrim($image, '/');
    }
}
