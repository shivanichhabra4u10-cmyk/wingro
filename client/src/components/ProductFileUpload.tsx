import React, { useState, useRef, useCallback } from 'react';
import { ProductFileType, getFileType, uploadProductFile } from '../services/productFileService';

// Stub for uploadThumbnail (not implemented in productFileService)
async function uploadThumbnail(file: File, productId: string): Promise<string | undefined> {
  // TODO: Implement actual thumbnail upload logic if needed
  return undefined;
}

interface ProductFileUploadProps {
  productId: string;
  onUploadComplete: (fileData: any) => void;
  allowMultiple?: boolean;
  maxFileSize?: number; // in bytes
  allowedFileTypes?: ProductFileType[];
}

const getFileTypeLabel = (fileType: ProductFileType): string => {
  switch (fileType) {
    case ProductFileType.PDF:
      return 'PDF Document';
    case ProductFileType.VIDEO:
      return 'Video File';
    case ProductFileType.PRESENTATION:
      return 'Presentation';
    case ProductFileType.EXCEL:
      return 'Spreadsheet';
    case ProductFileType.IMAGE:
      return 'Image';
    case ProductFileType.OTHER:
      return 'Other File';
  }
};

const FileTypeIcon: React.FC<{ fileType: ProductFileType }> = ({ fileType }) => {
  switch (fileType) {
    case ProductFileType.PDF:
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
      );
    case ProductFileType.VIDEO:
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
      );
    case ProductFileType.PRESENTATION:
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      );
    case ProductFileType.EXCEL:
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      );
    case ProductFileType.IMAGE:
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      );
    default:
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      );
  }
};

const ProductFileUpload: React.FC<ProductFileUploadProps> = ({
  productId,
  onUploadComplete,
  allowMultiple = false,
  maxFileSize = 50 * 1024 * 1024, // Default 50MB max file size
  allowedFileTypes,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFiles = Array.from(e.target.files || []);
    
    // Check file size
    const oversizedFiles = selectedFiles.filter(file => file.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed the maximum size of ${maxFileSize / (1024 * 1024)}MB`);
      return;
    }
    
    // Check file types if restrictions provided
    if (allowedFileTypes && allowedFileTypes.length > 0) {
      const invalidFiles = selectedFiles.filter(file => {
        const fileType = getFileType(file.name);
        return !allowedFileTypes.includes(fileType);
      });
      
      if (invalidFiles.length > 0) {
        setError(`Some files have unsupported formats. Allowed: ${allowedFileTypes.map(getFileTypeLabel).join(', ')}`);
        return;
      }
    }
    
    // Set files based on multiple allowance
    if (allowMultiple) {
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    } else {
      setFiles(selectedFiles.slice(0, 1));
    }
  };
  
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 2 * 1024 * 1024) { // 2MB max for thumbnails
        setError('Thumbnail exceeds 2MB size limit');
        return;
      }
      setThumbnailFile(selected);
    }
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setError(null);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    // Apply same validation as handleFileChange
    const oversizedFiles = droppedFiles.filter(file => file.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed the maximum size of ${maxFileSize / (1024 * 1024)}MB`);
      return;
    }
    
    if (allowedFileTypes && allowedFileTypes.length > 0) {
      const invalidFiles = droppedFiles.filter(file => {
        const fileType = getFileType(file.name);
        return !allowedFileTypes.includes(fileType);
      });
      
      if (invalidFiles.length > 0) {
        setError(`Some files have unsupported formats. Allowed: ${allowedFileTypes.map(getFileTypeLabel).join(', ')}`);
        return;
      }
    }
    
    // Set files based on multiple allowance
    if (allowMultiple) {
      setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
    } else {
      setFiles(droppedFiles.slice(0, 1));
    }
  }, [allowMultiple, allowedFileTypes, maxFileSize]);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      const uploadedFiles = [];
      const totalFiles = files.length;
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        // Upload thumbnail first if it exists and file is a video or presentation
        let thumbnailUrl;
        if (thumbnailFile) {
          thumbnailUrl = await uploadThumbnail(
            thumbnailFile,
            productId
          );
        }
        // Upload the main file
        const uploadedFile = await uploadProductFile(
          file,
          productId
        );
        // If we have a thumbnail, add it to the result
        if (thumbnailUrl) {
          uploadedFile.thumbnailUrl = thumbnailUrl;
        }
        uploadedFiles.push(uploadedFile);
        // Update progress
        setUploadProgress(((i + 1) / totalFiles) * 100);
      }
      
      // Reset the form
      setFiles([]);
      setThumbnailFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
      
      // Call the callback with uploaded files
      onUploadComplete(uploadedFiles.length === 1 ? uploadedFiles[0] : uploadedFiles);
    } catch (err) {
      console.error('File upload error:', err);
      setError(`Upload failed: ${(err as Error).message}`);
    } finally {
      setUploading(false);
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prevFiles => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };
  
  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
        
        <p className="text-lg font-medium">Drag files here or click to browse</p>
        <p className="text-sm text-gray-500 mt-1">
          {allowMultiple ? 'You can upload multiple files' : 'Upload a single file'}
        </p>
        {allowedFileTypes && (
          <p className="text-sm text-gray-500 mt-1">
            Allowed types: {allowedFileTypes.map(getFileTypeLabel).join(', ')}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-1">Max size: {maxFileSize / (1024 * 1024)}MB</p>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple={allowMultiple}
        accept={allowedFileTypes ? allowedFileTypes.map(type => {
          switch (type) {
            case ProductFileType.PDF: return 'application/pdf';
            case ProductFileType.VIDEO: return 'video/*';
            case ProductFileType.PRESENTATION: return '.ppt,.pptx,.key';
            case ProductFileType.EXCEL: return '.xls,.xlsx,.csv';
            case ProductFileType.IMAGE: return 'image/*';
            default: return '*/*';
          }
        }).join(',') : undefined}
      />
      
      {/* Show thumbnail uploader if files include video or presentation */}
      {files.some(file => {
        const type = getFileType(file.name);
        return type === ProductFileType.VIDEO || type === ProductFileType.PRESENTATION;
      }) && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Thumbnail (Recommended)</label>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => thumbnailInputRef.current?.click()}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Choose Thumbnail
            </button>
            <span className="text-sm text-gray-500">
              {thumbnailFile ? thumbnailFile.name : 'No file selected'}
            </span>
          </div>
          <input
            type="file"
            ref={thumbnailInputRef}
            onChange={handleThumbnailChange}
            className="hidden"
            accept="image/*"
          />
          <p className="mt-1 text-xs text-gray-500">
            Recommended size: 600x400px. Max 2MB.
          </p>
        </div>
      )}
      
      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files</h3>
          <ul className="space-y-2">
            {files.map((file, index) => {
              const fileType = getFileType(file.name);
              return (
                <li key={`${file.name}-${index}`} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 text-gray-500">
                      <FileTypeIcon fileType={fileType} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {getFileTypeLabel(fileType)} • {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="ml-3 flex-shrink-0 text-red-500 hover:text-red-700"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mt-4">
          {error}
        </div>
      )}
      
      {/* Upload progress */}
      {uploading && (
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            Uploading... {Math.round(uploadProgress)}%
          </p>
        </div>
      )}
      
      {/* Upload button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            files.length === 0 || uploading
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload Files'}
        </button>
      </div>
    </div>
  );
};

export default ProductFileUpload;
