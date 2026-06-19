# Changelog — FiberRoad E-Commerce

## All Changes & Fixes

### Bug Fix: "Please log in to add items to your cart" after login
**Root cause**: `SESSION_DOMAIN=localhost` in `.env` caused browsers to silently reject the session cookie (per RFC 6265, `localhost` has no dot, making it an invalid domain cookie). Every request appeared as a new session, so all API calls returned 401.

**Fix**: Removed `SESSION_DOMAIN=localhost` from `.env`. Without an explicit domain, the cookie is host-only and works correctly for `localhost:8000`.

### Bug Fix: 403 Forbidden after "Place Order" (order confirmation redirect)
**Root cause**: Same session cookie issue — the Inertia redirect to `/orders/{order}/confirmation` checked `auth()->id()` which returned `null` because the session never persisted.

**Fix (dual)**:
1. `.env` — Removed `SESSION_DOMAIN=localhost`
2. `app/Http/Controllers/Api/OrderController.php:92-94` — After placing order, logs the user into the session via `auth()->login()` as a safeguard

### Bug Fix: "images.map is not a function" on product detail page
**Root cause**: `product.images_urls` could be a non-array value (string/undefined) when the model's `$appends` serialized it, and `.map()` was called directly.

**Fix**:
1. `app/Models/Product.php:getImagesUrlsAttribute()` — Made the accessor defensive: checks `is_array()`, `is_string()`, and returns `[]` as final fallback
2. `resources/js/pages/product-detail.tsx:39-45` — Wrapped with `Array.isArray()` before calling `.map()`

### Enhancement: Sanctum Token-Based Authentication
Switched from session-only auth (which was broken) to token-based auth for API reliability.

#### `app/Http/Controllers/Api/AuthController.php`
- `login()` — Now calls `$user->createToken('auth-token')` and returns `token` in the response
- `register()` — Same token generation on registration
- `logout()` — Revokes the current access token via `currentAccessToken()->delete()`
- `me()` — Returns a `token` field; generates one if user is session-authenticated without a Bearer token

#### `resources/js/lib/axios.ts`
- Added `setAuthToken(token)` function — persists token to `localStorage` AND sets `Authorization: Bearer` header on the shared `api` instance
- On module init, reads existing token from `localStorage` and pre-configures the header
- On 401 responses, auto-removes the stored token
- Kept CSRF retry interceptor for 419 fallback

#### `resources/js/stores/auth-store.ts`
- Added `token` field to store state
- `login()` — Stores token via `setAuthToken()` and sets it in state. No longer calls `/sanctum/csrf-cookie`
- `register()` — Same pattern
- `logout()` — Calls API logout, clears token via `setAuthToken(null)`
- `checkAuth()` — Reads token from `localStorage`; if found, verifies via `/api/auth/me` with Bearer header. If not found, tries session-based auth first (server may return a new token)

#### `resources/js/components/layout/app-layout.tsx`
- On mount, initializes auth store from Inertia page props (`auth.user`) immediately to avoid flash of "not logged in" before `checkAuth()` completes
- Uses `useRef` to ensure one-time initialization

### Bug Fix: Cart sidebar stays open when clicking Checkout
**File**: `resources/js/components/layout/cart-drawer.tsx:124`
- Added `onClick={closeDrawer}` to the Checkout `<Link>` so the sidebar closes when navigating

### Enhancement: API Middleware Pipeline
**File**: `bootstrap/app.php`
- Added Sanctum's `EnsureFrontendRequestsAreStateful` middleware to the `api` middleware group, along with session/cookie middleware needed for SPA api compatibility

### Enhancement: Inertia Page Routes
**File**: `routes/web.php`
- Replaced placeholder controller routes with inline closures using `Inertia::render()`
- Added server-side product filtering (category, search, sort, featured)
- Added route binding by slug for products
- Added cart, checkout, orders, wishlist pages
- Added auth pages (login, register, forgot-password)
- Added help pages (FAQ, shipping, returns)
- Added static pages (about, contact)

### Enhancement: Product Model
**File**: `app/Models/Product.php`
- Added `$appends = ['has_stock', 'image_url', 'images_urls']` to auto-serialize computed attributes
- Added scopes: `scopeActive()`, `scopeByCategory()`, `scopeInStock()`, `scopeFeatured()`
- Added accessors: `getHasStockAttribute()`, `getImageUrlAttribute()`, `getImagesUrlsAttribute()`

### Enhancement: Frontend Stack Setup
- `composer.json` — Added `laravel/sanctum` dependency
- `package.json` — Added React, Inertia, TanStack Query, Zustand, Axios, Lucide, Radix UI, Sonner, CVA, Tailwind Merge
- `vite.config.js` — Added React plugin, changed input to `app.jsx`
- `tsconfig.json` — Added TypeScript configuration

### New Files Created
- **Controllers**: AuthController, CartController, CategoryController, OrderController, ProductController (API), ReviewController, SearchController, WishlistController, HealthController, HomeController, MetricsController
- **Models**: Address, CartItem, Order, OrderItem, Review, Wishlist (with factories, seeders, migrations)
- **Middleware**: HandleInertiaRequests, MetricsMiddleware
- **Config**: `inertia.php`, `sanctum.php`
- **Routes**: `routes/api.php` — Full API with auth, products, cart, checkout, orders, wishlist, reviews, search
- **JS**: Full React SPA — 20+ page components, custom hooks (use-cart, use-orders, use-products, use-categories, use-wishlist, use-search), Zustand stores (auth, cart, theme), axios client with token management, shared UI components (Button, Input, Skeleton, etc.)
- **Views**: `resources/views/app.blade.php` — Inertia root template
