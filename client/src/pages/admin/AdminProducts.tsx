import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { productsApiWithFiles } from '../../services/productsApiWithFiles';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Product {
  _id: string;
  id?: string; // allow id for compatibility
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  videos?: string[];
  files?: string[];
  category: string;
  featured: boolean;
  productType?: 'individual' | 'enterprise';
  oldPrice?: number;
  badge?: string;
  features?: string[];
  createdAt: string;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[] | null>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  // Product form state
  interface ProductFormData {
    name: string;
    description: string;
    price: number;
    oldPrice: number;
    image: string;
    images: string[];
    videos: string[];
    files: string[];
    category: string;
    productType: 'individual' | 'enterprise';
    badge: string;
    features: string[];
    featured: boolean;
    isFree: boolean;
  }
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    oldPrice: 0,
    image: '',
    images: [],
    videos: [],
    files: [],
    category: '',
    productType: 'individual',
    badge: '',
    features: [''],
    featured: false,
    isFree: false,
  });
  const [genericFiles, setGenericFiles] = useState<File[]>([]);
  const [genericFileLinks, setGenericFileLinks] = useState<string[]>([]);

  const handleGenericFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setGenericFiles(files);
      setGenericFileLinks(files.map(file => URL.createObjectURL(file)));
    }
  };
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [page, pageSize]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApiWithFiles.getAll({ page, limit: pageSize });
  // Defensive: ensure products is always an array
  const productsData = response.data?.data || response.data || response;
  setProducts(Array.isArray(productsData) ? productsData : []);
      setTotal(response.totalCount || response.data?.totalCount || 0);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (mode: 'create' | 'edit', product?: Product) => {
  setGenericFiles([]);
  setGenericFileLinks(product?.files || []);
  setFormMode(mode);
  if (mode === 'edit' && product) {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice || 0,
      image: product.image || '',
      images: product.images || [],
      videos: product.videos || [],
      files: product.files || [],
      category: product.category || '',
      productType: product.productType || 'individual',
      badge: product.badge || '',
      features: product.features || [''],
      featured: product.featured || false,
      isFree: false,
    });
    setImagePreviews(product.images || []);
    setVideoPreviews(product.videos || []);
  } else {
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      oldPrice: 0,
      image: '',
      images: [],
      videos: [],
      files: [],
      category: '',
      productType: 'individual',
      badge: '',
      features: [''],
      featured: false,
      isFree: false,
    });
    setImagePreviews([]);
    setVideoPreviews([]);
  }
  setIsFormOpen(true);
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

  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(files);
      setImagePreviews(files.map(file => URL.createObjectURL(file)));
    }
  };

  const handleVideoFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setVideoFiles(files);
      setVideoPreviews(files.map(file => URL.createObjectURL(file)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  console.log('[AdminProducts] handleSubmit called', { formMode, selectedProduct, formData });
    e.preventDefault();
    setError(null);
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
    try {
      setLoading(true);
  let productId = selectedProduct?._id || selectedProduct?.id;
      let productData = { ...formData };
  console.log('[AdminProducts] productId:', productId);
  console.log('[AdminProducts] productData before update:', productData);
      // 1. Create product if new
      if (formMode === 'create') {
        const resp = await productsApiWithFiles.create(productData);
        productId = resp._id || resp.data?._id;
        if (!productId) throw new Error('Product creation failed');
      }
      // 2. Upload files (images, videos, generic)
      let uploadedFiles: any[] = [];
      if (productId) {
        const allFiles: File[] = [...imageFiles, ...videoFiles, ...genericFiles];
        if (allFiles.length > 0) {
          uploadedFiles = await Promise.all(
            allFiles.map(file => productsApiWithFiles.uploadFile(productId as string, file))
          );
        }
      }
      // 3. Split uploaded files into images, videos, and files arrays
      let images: string[] = [];
      let videos: string[] = [];
      let files: any[] = [];
      for (const result of uploadedFiles) {
        const file = result.file || result;
        if (!file || !file.fileType) continue;
        if (file.fileType === 'image' || file.fileType === 'IMAGE') {
          images.push(file.url);
        } else if (file.fileType === 'video' || file.fileType === 'VIDEO') {
          videos.push(file.url);
        } else {
          files.push(file);
        }
      }
      productData.images = images.length ? images : formData.images;
      productData.videos = videos.length ? videos : formData.videos;
      productData.files = files.length ? files : formData.files;

      // Always call update for edit mode
      if (formMode === 'edit' && productId) {
        console.log('[AdminProducts] Calling productsApiWithFiles.update', { productId, productData });
        await productsApiWithFiles.update(productId, productData);
        console.log('[AdminProducts] productsApiWithFiles.update finished');
      }
      // If creating and files were uploaded, update again to attach file metadata
      if (formMode === 'create' && uploadedFiles.length > 0 && productId) {
        await productsApiWithFiles.update(productId, productData);
      }
      toast.success(formMode === 'create' ? 'Product created successfully!' : 'Product updated successfully!');
      handleCloseForm();
      await fetchProducts();
    } catch (err) {
      setError('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      setLoading(true);
      await productsApiWithFiles.delete(productId);
      toast.success('Product deleted successfully!');
      await fetchProducts();
    } catch (err) {
      setError('Failed to delete product. Please try again.');
    } finally {
      setLoading(false);
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
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {/* Defensive: handle products not being an array */}
          {(!Array.isArray(products) || products.length === 0) ? (
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
                  strokeWidth={2}
                  d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new product.</p>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-gray-200">
                {Array.isArray(products) && products.map(product => (
                  <li key={product._id} className="py-4 px-6 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.category}</div>
                      <div className="text-xs text-gray-400">{product.productType}</div>
                      <div className="text-xs text-gray-400">₹{product.price}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900" onClick={() => handleOpenForm('edit', product)}>Edit</button>
                      <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
              {/* Pagination Controls */}
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div>
                  <span className="text-sm text-gray-700">
                    Page {page} of {Math.ceil(total / pageSize)} | Total: {total}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                    onClick={() => setPage((p) => (p < Math.ceil(total / pageSize) ? p + 1 : p))}
                    disabled={page >= Math.ceil(total / pageSize)}
                  >
                    Next
                  </button>
                  <select
                    className="ml-2 px-2 py-1 border rounded"
                    value={pageSize}
                    onChange={e => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    {[5, 10, 20, 50].map(size => (
                      <option key={size} value={size}>{size} / page</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
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
                            <div key={`feature-${index}`} className="flex mb-2">
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
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Feature
                          </button>
                        </div>
                        {/* Carousel Images */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Carousel Images</label>
                          <input type="file" accept="image/*" multiple onChange={handleImageFilesChange} />
                          <div className="flex gap-2 mt-2">
                            {imagePreviews.map((src, idx) => (
                              <img key={`img-${src}-${idx}`} src={src} alt="preview" className="h-16 w-16 object-cover rounded" />
                            ))}
                          </div>
                        </div>
                        {/* Carousel Videos */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Carousel Videos</label>
                          <input type="file" accept="video/*" multiple onChange={handleVideoFilesChange} />
                          <div className="flex gap-2 mt-2">
                            {videoPreviews.map((src, idx) => (
                              <video key={`vid-${src}-${idx}`} src={src} controls className="h-16 w-24 rounded" />
                            ))}
                          </div>
                        </div>
                        {/* Product Files (any type) - moved to bottom */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Product File (main digital product)</label>
                          <input type="file" multiple onChange={handleGenericFilesChange} />
                          <div className="flex flex-col gap-1 mt-2">
                            {genericFileLinks.map((src, idx) => {
                              let fileName = '';
                              // src can be a string (URL) or an object (file metadata)
                              if (typeof src === 'string') {
                                fileName = src.split('/').pop() || `File ${idx+1}`;
                              } else if (
                                src && typeof src === 'object' &&
                                'originalName' in src && typeof (src as any).originalName === 'string'
                              ) {
                                fileName = (src as any).originalName;
                              } else {
                                fileName = `File ${idx+1}`;
                              }
                              const href = typeof src === 'string' ? src : (src && typeof src === 'object' && 'url' in src ? (src as any).url : '#');
                              return (
                                <a key={`file-${typeof src === 'string' ? src : fileName}-${idx}`} href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                  {fileName}
                                </a>
                              );
                            })}
                          </div>
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