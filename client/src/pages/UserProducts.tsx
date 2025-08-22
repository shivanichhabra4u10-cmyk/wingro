import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { productsApiWithFiles } from '../services/productsApiWithFiles';
import { ProductFile } from '../services/productFileService';
import { useAuth } from '../context/AuthContext';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
  productType?: 'individual' | 'enterprise';
  oldPrice?: number;
  badge?: string;
  features?: string[];
  createdAt: string;
  isFree?: boolean;
  files?: ProductFile[];
}

const UserProducts: React.FC = () => {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [purchased, setPurchased] = useState<string[]>([]); // product IDs
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  useEffect(() => {
    fetchProducts();
    // Optionally fetch purchased products for user
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApiWithFiles.getAll();
      setProducts(response.data || response);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (product: Product) => {
    try {
      setDownloading(product._id);
      // Simulate purchase API call
      await productsApiWithFiles.purchase(product._id);
      setPurchased(prev => [...prev, product._id]);
      toast.success('Purchase successful! You can now download the files.');
    } catch (err: any) {
      toast.error(err.message || 'Purchase failed.');
    } finally {
      setDownloading(null);
    }
  };

  const handleDownload = async (file: ProductFile) => {
    try {
      setDownloading(file.fileId);
      // Use signed URL for download
      window.open(file.url, '_blank');
    } catch (err: any) {
      toast.error('Download failed.');
    } finally {
      setDownloading(null);
    }
  };

  // Pagination logic
  const totalCount = products.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginatedProducts = products.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-lg text-gray-700">Loading products...</span>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="text-sm text-gray-500">Showing {paginatedProducts.length} of {totalCount} products</div>
            <div className="flex items-center gap-2">
              <label htmlFor="userProductPageSize" className="block text-xs font-medium text-gray-700">Per page:</label>
              <select
                id="userProductPageSize"
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="border rounded px-2 py-1 text-sm bg-white"
              >
                {[6, 9, 12, 24].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedProducts.map(product => (
              <div key={product._id} className="bg-white rounded-lg shadow p-6 flex flex-col">
                <img src={product.image} alt={product.name} className="h-40 w-full object-cover rounded mb-4" />
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <div className="flex items-center gap-2 mb-2">
                  {product.isFree ? (
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">Free</span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">₹{product.price}</span>
                  )}
                  {product.featured && (
                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">Featured</span>
                  )}
                </div>
                <div className="flex-1" />
                {product.isFree || purchased.includes(product._id) ? (
                  <>
                    {product.files && product.files.length > 0 ? (
                      <div className="mt-4">
                        <h4 className="text-xs font-semibold text-gray-600 mb-2">Download Files</h4>
                        <ul className="space-y-1">
                          {product.files.map(file => (
                            <li key={file.fileId} className="flex items-center justify-between bg-gray-50 rounded p-2">
                              <span className="truncate text-xs">{file.originalName}</span>
                              <button
                                className="text-blue-600 text-xs ml-2 hover:underline disabled:opacity-50"
                                disabled={downloading === file.fileId}
                                onClick={() => handleDownload(file)}
                              >
                                {downloading === file.fileId ? 'Downloading...' : 'Download'}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 mt-2">No files available.</div>
                    )}
                  </>
                ) : (
                  <button
                    className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                    disabled={downloading === product._id}
                    onClick={() => handleBuy(product)}
                  >
                    {downloading === product._id ? 'Processing...' : `Buy & Download`}
                  </button>
                )}
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-l-lg font-medium transition-colors ${page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                  let pageNumber: number;
                  if (totalPages <= 5) {
                    pageNumber = index + 1;
                  } else {
                    let startPage = Math.max(1, page - 2);
                    if (page > totalPages - 2) {
                      startPage = totalPages - 4;
                    }
                    pageNumber = startPage + index;
                  }
                  if (pageNumber < 1 || pageNumber > totalPages) return null;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`px-4 py-2 font-medium transition-colors border-x border-gray-300 first:border-l-0 last:border-r-0 ${page === pageNumber ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 text-gray-700'}`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className={`px-4 py-2 rounded-r-lg font-medium transition-colors ${page === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserProducts;
