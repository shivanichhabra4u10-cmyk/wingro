// Temporary file with ProductAdminPanel form code
import React, { useState, useEffect } from 'react';

/*
 * This is just a reference implementation for the ProductAdminPanel form
 * for fixing the existing component in Products.tsx
 */

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  category: string;
  productType: 'individual' | 'enterprise';
  images: string[];
  features: string[];
  enterpriseFeatures: string[];
  enterpriseSubcategory: string;
}

const ProductForm: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    oldPrice: 0,
    badge: '',
    category: 'digital',
    productType: 'individual',
    images: [''],
    features: [''],
    enterpriseFeatures: [''],
    enterpriseSubcategory: ''
  });
  
  // This is just for reference
  const renderForm = () => (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">
          Add New Product
        </h3>
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to List
        </button>
      </div>

      <form className="space-y-6">
        <div className="bg-blue-50 p-4 mb-6 rounded-md">
          <h4 className="font-medium text-blue-700 mb-2">Product Basic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Product Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required
                placeholder="Enter product name"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-700">Price <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                required
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
  
  return renderForm();
};

export default ProductForm;
