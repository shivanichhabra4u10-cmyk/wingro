import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { productsApiWithFiles } from '../../services/productsApiWithFiles';
import ProductFileUpload from '../../components/ProductFileUpload';
import { ProductFileType, ProductFile, uploadProductFile } from '../../services/productFileService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
}

const AdminProducts: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    oldPrice: 0,
    images: [] as string[],
    category: '',
    productType: 'individual' as 'individual' | 'enterprise',
    badge: '',
    features: [''],
    featured: false,
    files: [] as ProductFile[],
    isFree: false,
  });
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApiWithFiles.getAll();
      setProducts(response.data || response);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (mode: 'create' | 'edit', product?: Product) => {
    setFormMode(mode);
    setPendingFiles([]);
    setFilesToDelete([]);
    setImagePreviews([]);
    if (mode === 'edit' && product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        oldPrice: product.oldPrice || 0,
        images: ((product as any).images || (product.image ? [product.image] : [])).filter(Boolean),
        category: product.category,
        productType: product.productType || 'individual',
        badge: product.badge || '',
        features: product.features || [''],
        featured: product.featured,
        files: (product as any).files || [],
        isFree: (product as any).isFree || false,
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        oldPrice: 0,
        images: [],
        category: '',
        productType: 'individual',
        badge: '',
        features: [''],
        featured: false,
        files: [],
        isFree: false,
      });
    }
    setIsFormOpen(true);
    setSaveSuccess(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedProduct(null);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : name === 'price' || name === 'oldPrice'
          ? parseFloat(value) || 0
          : value
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData(prev => {
      const updatedFeatures = [...prev.features];
      updatedFeatures[index] = value;
      return {
        ...prev,
        features: updatedFeatures
      };
    });
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => {
      const updatedFeatures = prev.features.filter((_, i) => i !== index);
      return {
        ...prev,
        features: updatedFeatures.length ? updatedFeatures : ['']
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaveSuccess(null);
    // Allow price and oldPrice to be 0, only check for empty string/null
    if (
      !formData.name ||
      !formData.description ||
      !formData.category ||
      formData.name.trim() === '' ||
      formData.description.trim() === '' ||
      formData.category.trim() === ''
    ) {
      setError('Please fill in all required fields.');
      return;
    }
    // Allow update if product already has images, even if no new images are uploaded
    if (
      (!pendingFiles || pendingFiles.length === 0) &&
      (!formData.images || formData.images.length === 0) &&
      !(formMode === 'edit' && selectedProduct && (
        ((selectedProduct as any).images && Array.isArray((selectedProduct as any).images) && (selectedProduct as any).images.length > 0)
        || (selectedProduct.image && typeof selectedProduct.image === 'string' && selectedProduct.image.length > 0)
      ))
    ) {
          // Allow product creation even if there are no images, as long as files are present.
    }
    try {
      setLoading(true);
      // Use the already-uploaded images and files from formData
      const productDataWithFilesAndImages = {
        ...formData,
        images: Array.isArray(formData.images) ? formData.images.filter(img => typeof img === 'string' && img) : [],
        files: Array.isArray(formData.files) ? formData.files : [],
      };
      setImagePreviews([]);
      setPendingFiles([]);
      setFormData(prev => ({ ...prev, images: [], files: [] }));
      if (formMode === 'create') {
        await productsApiWithFiles.create(productDataWithFilesAndImages, []);
        toast.success('Product created successfully!');
        handleCloseForm();
        await fetchProducts();
      } else if (formMode === 'edit' && selectedProduct?._id) {
        await productsApiWithFiles.update(selectedProduct._id, productDataWithFilesAndImages, [], filesToDelete);
        toast.success('Product updated successfully!');
        handleCloseForm();
        await fetchProducts();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await productsApiWithFiles.delete(id);
        await fetchProducts();
        toast.success('Product deleted successfully!');
      } catch (err: any) {
        setError(err.message || 'Failed to delete product. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-8 bg-gradient-to-br from-gray-50 via-white to-indigo-50 min-h-screen">
      <div className="flex justify-between items-center mb-7">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">Product Management</h1>
          <p className="mt-1 text-sm text-gray-500">Add, edit, and manage products for the WinGroX AI marketplace.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-md shadow text-sm text-gray-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 transition"
          >
            <svg className="-ml-1 mr-1 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </button>
          <button
            onClick={() => handleOpenForm('create')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow text-sm text-white bg-gradient-to-r from-indigo-500 to-blue-400 hover:from-indigo-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 transition"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Product
          </button>
        </div>
      </div>
      {/* Only show error on main page if not in modal */}
      {error && !isFormOpen && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-lg text-gray-700">Loading products...</span>
        </div>
      ) : (
        <>
          <div>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
                <div className="mt-6">
                  <button
                    onClick={() => handleOpenForm('create')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Product
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product, idx) => {
                  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
                  const discount = hasDiscount ? Math.round(100 * (product.oldPrice! - product.price) / product.oldPrice!) : 0;
                  return (
                    <div key={product._id || idx} className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                      <div className="text-lg font-semibold text-gray-900 mb-2 text-center w-full truncate">{product.name}</div>
                      <div className="flex items-center gap-2 mb-2">
                        {product.oldPrice ? (
                          <span className="text-gray-400 line-through text-sm">₹{product.oldPrice.toFixed(2)}</span>
                        ) : null}
                        <span className="text-pink-600 font-bold text-xl">₹{product.price.toFixed(2)}</span>
                        {hasDiscount && (
                          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">{discount}% OFF</span>
                        )}
                      </div>
                      <div className="flex gap-3 mt-4 w-full justify-center">
                        <button
                          className="px-4 py-2 rounded bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition"
                          title="Download"
                          onClick={() => window.open(`/api/downloads/${product._id}`, '_blank')}
                        >
                          Download
                        </button>
                        <button
                          className="px-4 py-2 rounded bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition"
                          title="Buy"
                          onClick={() => window.open(`/products/${product._id}`, '_blank')}
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
      {isFormOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-100">
              <div className="bg-white px-6 pt-6 pb-4 sm:p-8 sm:pb-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-semibold text-gray-800">
                      {formMode === 'create' ? 'Add New Product' : 'Edit Product'}
                    </h3>
                    {/* Show error in modal if present */}
                    {error && (
                      <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-4 mt-2">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="mt-2">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Product Name */}
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Product Name <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        {/* Description */}
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description <span className="text-red-400">*</span>
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        {/* Price and Old Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                              Price (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="price"
                              id="price"
                              min="0"
                              step="0.01"
                              value={formData.price}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor="oldPrice" className="block text-sm font-medium text-gray-700">
                              Old Price (₹) <span className="text-gray-400 text-xs">(Optional)</span>
                            </label>
                            <input
                              type="number"
                              name="oldPrice"
                              id="oldPrice"
                              min="0"
                              step="0.01"
                              value={formData.oldPrice}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        {/* Category and Product Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                              Category <span className="text-red-400">*</span>
                            </label>
                            <select
                              id="category"
                              name="category"
                              value={formData.category}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="">Select a category</option>
                              <option value="digital">Digital</option>
                              <option value="platform">Platform</option>
                              <option value="enterprise">Enterprise</option>
                              <option value="course">Course</option>
                              <option value="service">Service</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="productType" className="block text-sm font-medium text-gray-700">
                              Product Type
                            </label>
                            <select
                              id="productType"
                              name="productType"
                              value={formData.productType}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="individual">Individual</option>
                              <option value="enterprise">Enterprise</option>
                            </select>
                          </div>
                        </div>
                        {/* Badge */}
                        <div>
                          <label htmlFor="badge" className="block text-sm font-medium text-gray-700">
                            Badge <span className="text-gray-400 text-xs">(optional)</span>
                          </label>
                          <select
                            name="badge"
                            id="badge"
                            value={formData.badge}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="">None</option>
                            <option value="New">New</option>
                            <option value="Best Seller">Best Seller</option>
                            <option value="Popular">Popular</option>
                            <option value="Premium">Premium</option>
                            <option value="AI-Powered">AI-Powered</option>
                            <option value="Quick Win">Quick Win</option>
                            <option value="Flagship">Flagship</option>
                            <option value="Enterprise">Enterprise</option>
                            <option value="Teams">Teams</option>
                          </select>
                        </div>
                        {/* Features */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Features
                          </label>
                          {formData.features.map((feature, index) => (
                            <div key={index} className="flex mb-2">
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                placeholder={`Feature ${index + 1}`}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="ml-2 inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addFeature}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Feature
                          </button>
                        </div>
                        {/* Featured */}
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="featured"
                              name="featured"
                              type="checkbox"
                              checked={formData.featured}
                              onChange={handleInputChange}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="featured" className="font-medium text-gray-700">
                              Featured Product
                            </label>
                            <p className="text-gray-500">Featured products appear at the top of the list.</p>
                          </div>
                        </div>
                        {/* Product File Upload */}
                        <div className="mt-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Product Files (PPT, Video, PDF, etc.)</label>
                          <ProductFileUpload
                            productId={selectedProduct?._id || 'new'}
                            onUploadComplete={(files) => {
                              // Separate images and other files
                              const fileArr = Array.isArray(files) ? files : [files];
                              const images = fileArr.filter(f => f.fileType === ProductFileType.IMAGE && f.url).map(f => f.url);
                              const mainFiles = fileArr.filter(f => f.fileType !== ProductFileType.IMAGE);
                              setFormData(prev => ({
                                ...prev,
                                images: [...(prev.images || []), ...images],
                                files: [...(prev.files || []), ...mainFiles],
                              }));
                            }}
                            allowMultiple={true}
                            allowedFileTypes={[ProductFileType.PRESENTATION, ProductFileType.VIDEO, ProductFileType.PDF, ProductFileType.IMAGE, ProductFileType.OTHER]}
                          />
                          {formMode === 'edit' && formData.files && formData.files.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-xs font-semibold text-gray-600 mb-2">Existing Files</h4>
                              <ul className="space-y-1">
                                {formData.files.map((file: ProductFile, idx: number) => (
                                  <li key={file.fileId} className="flex items-center justify-between bg-gray-50 rounded p-2">
                                    <span className="truncate text-xs">{file.originalName}</span>
                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        className="text-blue-500 text-xs ml-2 hover:underline"
                                        onClick={async () => {
                                          window.open(file.url, '_blank');
                                        }}
                                      >Download</button>
                                      <button
                                        type="button"
                                        className="text-red-500 text-xs ml-2"
                                        onClick={() => {
                                          setFilesToDelete(prev => [...prev, file.fileId]);
                                          setFormData(prev => ({
                                            ...prev,
                                            files: prev.files.filter((f: ProductFile) => f.fileId !== file.fileId)
                                          }));
                                        }}
                                      >Remove</button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-400 text-base font-medium text-white hover:from-indigo-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 sm:ml-3 sm:w-auto sm:text-sm transition"
                          >
                            {formMode === 'create' ? 'Create Product' : 'Update Product'}
                          </button>
                          <button
                            type="button"
                            onClick={handleCloseForm}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-200 shadow px-4 py-2 bg-white text-base font-medium text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-200 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;