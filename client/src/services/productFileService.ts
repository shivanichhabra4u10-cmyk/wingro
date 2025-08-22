import { uploadAnyFile, getFileUrl } from './storageService';

/**
 * Product File Types
 */
export enum ProductFileType {
  PDF = 'pdf',
  VIDEO = 'video',
  PRESENTATION = 'presentation',
  EXCEL = 'excel',
  IMAGE = 'image',
  OTHER = 'other'
};

/**
 * Interface for uploaded product files
 */
export interface ProductFile {
  fileId: string;
  originalName: string;
  fileType: ProductFileType;
  url: string;
  size: number;
  uploadDate: string;
  metadata?: Record<string, any>;
  thumbnailUrl?: string;
}

export async function uploadProductFile(file: File, productId: string): Promise<ProductFile> {
  const path = `products/${productId}/${file.name}`;
  await uploadAnyFile(file, path);
  const url = await getFileUrl(path);
  return {
    fileId: path,
    originalName: file.name,
    fileType: getFileType(file.name),
    url,
    size: file.size,
    uploadDate: new Date().toISOString(),
    metadata: {},
    thumbnailUrl: undefined,
  };
}

// Helper to guess file type from extension
export function getFileType(name: string): ProductFileType {
  if (!name || typeof name !== 'string' || !name.includes('.')) {
    return ProductFileType.OTHER;
  }
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf': return ProductFileType.PDF;
    case 'mp4':
    case 'mov':
    case 'avi': return ProductFileType.VIDEO;
    case 'ppt':
    case 'pptx': return ProductFileType.PRESENTATION;
    case 'xls':
    case 'xlsx': return ProductFileType.EXCEL;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif': return ProductFileType.IMAGE;
    default: return ProductFileType.OTHER;
  }
}

export async function getProductFileUrl(productId: string, fileName: string): Promise<string> {
  return await getFileUrl(`products/${productId}/${fileName}`);
}

// Stub for deleting a product file (Supabase: remove by path)
export async function deleteProductFile(fileId: string): Promise<void> {
  // TODO: Implement actual deletion with Supabase Storage if needed
  return;
}

  /**
   * Upload a product file
   */

// All other product file operations (delete, list, etc.) can be implemented similarly using Supabase Storage if needed.
