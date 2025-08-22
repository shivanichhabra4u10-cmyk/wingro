import { products } from './api';
import { ProductFile, ProductFileType, uploadProductFile } from './productFileService';
import { api } from './api';

// Extended API for products with file management
export const productsApiWithFiles = {
  // Core product APIs (same as before)
  getAll: async (params?: { 
    productType?: string; 
    page?: number; 
    limit?: number; 
    sortBy?: string; 
    sortOrder?: number; 
    search?: string; 
    category?: string; 
    fileType?: string; 
    minPrice?: number; 
    maxPrice?: number 
  }) => {
    try {
      const response = await products.getAll(params);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  getById: async (id: string) => {
    try {
      const response = await products.getById(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },
  
  // Enhanced product creation with files
  create: async (productData: any, files?: File[]) => {
    try {
      // First create the product to get an ID
      const response = await products.create(productData);
      console.log('Product create API response:', response);
      // Defensive: support both response.data.data and response.data
      const productDataObj = response.data?.data || response.data;
      if (!productDataObj || !productDataObj._id) {
        throw new Error('Product creation response missing _id. Full response: ' + JSON.stringify(response));
      }
      const productId = productDataObj._id;

      // If we have files, upload them and update the product
      if (files && files.length > 0) {
        try {
          const productFiles = await uploadProductFiles(files, productId);
          // Update the product with file information
          const updatedProduct = {
            ...productDataObj,
            files: productFiles,
            hasFiles: true,
          };
          // Update the product
          const updateResponse = await products.update(productId, updatedProduct);
          console.log('Product update with files response:', updateResponse);
          if (!updateResponse.data || !Array.isArray(updateResponse.data.files) || updateResponse.data.files.length === 0) {
            throw new Error('Product update succeeded but files array is missing or empty.');
          }
          return updateResponse.data;
        } catch (fileUpdateError) {
          console.error('Error updating product with files:', fileUpdateError);
          throw fileUpdateError;
        }
      } else {
        // If no files, ensure files is at least an empty array
        if (!productDataObj.files) {
          const updateResponse = await products.update(productId, { ...productDataObj, files: [] });
          return updateResponse.data;
        }
      }
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  
  // Enhanced product update with files
  update: async (id: string, productData: any, files?: File[], filesToDelete?: string[]) => {
    try {
      console.log('[productsApiWithFiles.update] START', { id, productData, files, filesToDelete });
      // Handle file deletions if any
      if (filesToDelete && filesToDelete.length > 0) {
        await Promise.all(filesToDelete.map(filePath => {
          // TODO: Implement deleteProductFile as a named export if needed
          // productFileService.deleteProductFile(filePath)
          // For now, skip or implement delete logic here
          // Example: await deleteProductFile(filePath);
          // (deleteProductFile not implemented in productFileService)
          return Promise.resolve();
        }));
      }

      // Upload new files if any
      let productFiles: ProductFile[] = [];
      if (files && files.length > 0) {
        productFiles = await uploadProductFiles(files, id);
        // Merge with existing files
        const existingFiles = productData.files || [];
        productData.files = [...existingFiles, ...productFiles];
        productData.hasFiles = true;
      } else {
        // If no new files, preserve existing files if present
        if (!productData.files) {
          // Fetch the current product to get its files
          const current = await products.getById(id);
          productData.files = current.data?.files || [];
        }
      }

      console.log('[productsApiWithFiles.update] before API call', { id, productData });
      // Update the product
      const response = await products.update(id, productData);
      console.log('[productsApiWithFiles.update] after API call', { response });
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      // Get the product to find associated files
      const productResponse = await api.get(`/api/products/${id}`);
      const product = productResponse.data.data;
      
      // Delete associated files if any
      if (product.files && Array.isArray(product.files) && product.files.length > 0) {
        await Promise.all(product.files.map((file: ProductFile) => {
          // TODO: Implement deleteProductFile as a named export if needed
          // productFileService.deleteProductFile(file.fileId)
          // For now, skip or implement delete logic here
          // Example: await deleteProductFile(file.fileId);
          // (deleteProductFile not implemented in productFileService)
          return Promise.resolve();
        }));
      }
      
      // Delete the product
      const response = await api.delete(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },
  
  // File-specific operations
  uploadFile: async (productId: string, file: File, metadata?: Record<string, any>) => {
    try {
      const productFile = await uploadProductFile(file, productId);
      
      // Update the product record with the new file
      const productResponse = await api.get(`/api/products/${productId}`);
      const product = productResponse.data.data;
      
      const files = product.files || [];
      files.push(productFile);
      
      const updatedProduct = {
        ...product,
        files,
        hasFiles: true,
      };
      
      // Update the product
      const updateResponse = await api.put(`/api/products/${productId}`, updatedProduct);
      return {
        file: productFile,
        product: updateResponse.data.data
      };
    } catch (error) {
      console.error(`Error uploading file for product ${productId}:`, error);
      throw error;
    }
  },
  
  deleteFile: async (productId: string, fileId: string) => {
    try {
      // Delete the actual file
      // TODO: Implement deleteProductFile as a named export if needed
      // await productFileService.deleteProductFile(fileId);
      // For now, skip or implement delete logic here
      // Example: await deleteProductFile(fileId);
      // (deleteProductFile not implemented in productFileService)
      
      // Update the product record
      const productResponse = await api.get(`/api/products/${productId}`);
      const product = productResponse.data.data;
      
      // Remove the file from the product's files array
      const updatedFiles = (product.files || []).filter(
        (file: ProductFile) => file.fileId !== fileId
      );
      
      const updatedProduct = {
        ...product,
        files: updatedFiles,
        hasFiles: updatedFiles.length > 0,
      };
      
      // Update the product
      const updateResponse = await api.put(`/api/products/${productId}`, updatedProduct);
      return updateResponse.data;
    } catch (error) {
      console.error(`Error deleting file ${fileId} for product ${productId}:`, error);
      throw error;
    }
  },
  
  // Get all files for a product
  getFiles: async (productId: string) => {
    try {
      const response = await products.getById(productId);
      return response.data.data.files || [];
    } catch (error) {
      console.error(`Error getting files for product ${productId}:`, error);
      throw error;
    }
  },

  // Simulate product purchase (should call backend endpoint in real app)
  purchase: async (productId: string) => {
    // TODO: Replace with real purchase API call
    // Example: await axios.post(`/api/products/${productId}/purchase`);
    return Promise.resolve({ success: true });
  },

  // Get secure download URL for a file (should call backend endpoint in real app)
  getDownloadUrl: async (productId: string, fileId: string) => {
    // TODO: Replace with real API call to get signed URL
    // Example: const res = await axios.get(`/api/products/${productId}/files/${fileId}/download-url`);
    // return res.data.url;
    return null;
  }
};

// Helper function to upload multiple files for a product
async function uploadProductFiles(files: File[], productId: string): Promise<ProductFile[]> {
  // Filter out files without a valid name and throw an error if any are invalid
  const invalidFiles = files.filter(f => !f || !f.name || typeof f.name !== 'string' || f.name.trim() === '');
  if (invalidFiles.length > 0) {
    throw new Error('One or more files are missing a valid name. Please re-select your files and try again.');
  }
  const uploadPromises = files.map(file => uploadProductFile(file, productId));
  return await Promise.all(uploadPromises);
}

export default productsApiWithFiles;
