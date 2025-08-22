import React, { useEffect, useState } from 'react';
import { productsApiWithFiles } from '../services/productsApiWithFiles';
import { Product } from '../types/product';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [productType, setProductType] = useState('');
  // Dynamically extract unique categories and product types from products
  // Capitalize first letter utility
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  const uniqueProductTypes = Array.from(new Set(products.map(p => p.productType).filter(Boolean)));
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productsApiWithFiles.getAll();
        console.log('Products API response:', response);
        if (Array.isArray(response)) {
          setProducts(response);
        } else if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (response.products && Array.isArray(response.products)) {
          setProducts(response.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Products API error:', err);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-xl p-8 md:p-12 text-white relative overflow-hidden mb-8 shadow-lg">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-400 mb-4 tracking-tight" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
            Explore Our Products
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Discover innovative tools and resources designed to accelerate your growth journey.
          </p>
        </div>
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
      </section>
      <div className="container mx-auto px-4 pb-16">
        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow p-6 mb-8 flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{capitalize(cat)}</option>
              ))}
            </select>
            <select
              value={productType}
              onChange={e => setProductType(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Types</option>
              {uniqueProductTypes.map(type => (
                <option key={type} value={type}>{capitalize(type)}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
              min={0}
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
              min={0}
            />
          </div>
        </div>
        {loading ? (
          <div className="text-center py-12 text-xl text-blue-700">Loading products...</div>
        ) : error ? (
          <div className="text-center py-12 text-xl text-red-600">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-xl text-gray-500">No products available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products
              .filter(product => {
                // Search filter
                if (search && !product.name.toLowerCase().includes(search.toLowerCase())) return false;
                // Category filter (admin-aligned)
                if (category && product.category !== category) return false;
                // Product type filter (admin-aligned)
                if (productType && product.productType !== productType) return false;
                // Min price filter
                if (minPrice && product.price < Number(minPrice)) return false;
                // Max price filter
                if (maxPrice && product.price > Number(maxPrice)) return false;
                return true;
              })
              .map((product) => {
              const hasDiscount = typeof product.oldPrice === 'number' && product.oldPrice > product.price;
              const discount = hasDiscount && product.oldPrice ? Math.round(100 * (product.oldPrice - product.price) / product.oldPrice) : 0;
              // Placeholder image if not present
              const imageUrl = product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300x200?text=Product';
              // Placeholder rating/review (since not in Product type)
              const rating = 4.3;
              const reviewCount = Math.floor(Math.random() * 200 + 20);
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow border border-gray-200 flex flex-col transition-transform hover:-translate-y-1 hover:shadow-xl hover:border-blue-300 overflow-hidden"
                >
                  <div className="relative w-full aspect-[4/3] bg-gray-100">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="object-cover w-full h-full rounded-t-xl"
                    />
                    <button className="absolute top-2 right-2 bg-white/80 rounded-full p-2 shadow hover:bg-pink-100 transition" title="Wishlist">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-pink-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.54 0-2.877.792-3.562 2.008C11.565 4.542 10.228 3.75 8.688 3.75 6.099 3.75 4 5.765 4 8.25c0 7.22 8 11.25 8 11.25s8-4.03 8-11.25z" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-gray-900 truncate">{product.name}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500 truncate">{product.category || product.productType || 'Product'}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base font-bold text-gray-900">Rs. {product.price.toLocaleString()}</span>
                      {hasDiscount && product.oldPrice && (
                        <span className="text-gray-400 line-through text-sm">Rs. {product.oldPrice.toLocaleString()}</span>
                      )}
                      {hasDiscount && (
                        <span className="text-xs font-semibold text-green-700 bg-green-100 rounded px-2 py-0.5">{discount}% OFF</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-white bg-blue-600 rounded px-2 py-0.5">{rating.toFixed(1)} ★</span>
                      <span className="text-xs text-gray-500">{reviewCount}</span>
                    </div>
                    <div className="mt-auto flex flex-col items-center w-full">
                      <a
                        href={product._id || product.id ? `/product/${product._id || product.id}` : '#'}
                        className="w-full px-4 py-2 rounded bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition text-center"
                        onClick={e => { if (!(product._id || product.id)) { e.preventDefault(); alert('Product ID missing.'); } }}
                      >Download</a>
                    </div>
                  </div>
                </div>
              );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
