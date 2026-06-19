<?php

namespace App\Models;

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
        if ($this->image) {
            return asset('storage/' . $this->image);
        }
        return null;
    }

    public function getImagesUrlsAttribute()
    {
        $imgs = $this->images;
        if (is_array($imgs)) return $imgs;
        if (is_string($imgs)) {
            $decoded = json_decode($imgs, true);
            return is_array($decoded) ? $decoded : [$imgs];
        }
        return [];
    }
}
