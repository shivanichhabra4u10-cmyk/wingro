# WinGroX File Storage System

This document explains how to use the decoupled file storage system for product files in the WinGroX platform.

## Architecture Overview

The storage system is designed with flexibility in mind, allowing you to easily switch between different storage providers without changing your application code.

### Key Components:

1. **Storage Service** (`storageService.ts`): The main entry point that provides a unified API for file operations.
2. **Storage Provider Interface**: An abstraction that different providers implement.
3. **Provider Implementations**:
   - Firebase Storage (default)
   - Cloudflare R2 (future option)
   - Mock Provider (for development and testing)
4. **Product File Service** (`productFileService.ts`): A specialized service for handling product-related files.
5. **Migration Utility** (`storageMigration.ts`): A tool to help migrate files between providers.

## Storage Providers

### Currently Supported:
- **Firebase Storage**: The default provider, used in production.
- **Mock Storage**: Used in development for testing without actual cloud storage.

### Future Support:
- **Cloudflare R2**: Implementation is ready for when you decide to migrate.

## How to Use

### Basic File Operations

```typescript
import storageService from '../services/storageService';

// Upload a file
const file = e.target.files[0];
const path = `products/${productId}/${file.name}`;
const url = await storageService.uploadFile(file, path);

// Get a file URL
const url = await storageService.getFileUrl(path);

// Delete a file
await storageService.deleteFile(path);

// List files
const files = await storageService.listFiles('products/123');
```

### Product-Specific Operations

```typescript
import productFileService from '../services/productFileService';
import { ProductFileType } from '../services/productFileService';

// Upload a product file
const file = e.target.files[0];
const productFile = await productFileService.uploadProductFile(
  file, 
  productId,
  { description: 'Product manual' }
);

// Upload a thumbnail for a video
const thumbnail = e.target.files[0];
const thumbnailUrl = await productFileService.uploadThumbnail(
  thumbnail,
  productId
);

// Get file type
const fileType = productFileService.getFileType(file);
if (fileType === ProductFileType.VIDEO) {
  // Handle video file
}
```

### Using the Enhanced Products API

```typescript
import productsApiWithFiles from '../services/productsApiWithFiles';

// Create a product with files
const files = fileInputRef.current.files;
const newProduct = {
  name: 'Product Name',
  description: 'Product Description',
  price: 599,
  // other product fields...
};

const result = await productsApiWithFiles.create(newProduct, files);

// Update a product with new files
const updatedProduct = {
  ...product,
  name: 'Updated Name',
  // other updated fields...
};

const filesToDelete = ['products/123/old-file.pdf']; // Paths of files to delete
const result = await productsApiWithFiles.update(
  product.id,
  updatedProduct,
  newFiles,
  filesToDelete
);

// Add a single file to an existing product
const result = await productsApiWithFiles.uploadFile(productId, file);

// Delete a file from a product
await productsApiWithFiles.deleteFile(productId, fileId);
```

## Components

### Product File Upload

```jsx
import ProductFileUpload from '../components/ProductFileUpload';

// In your component:
const handleUploadComplete = (fileData) => {
  console.log('Uploaded files:', fileData);
  // Update your product state with the new file data
};

// In your render method:
<ProductFileUpload
  productId={product.id}
  onUploadComplete={handleUploadComplete}
  allowMultiple={true}
  maxFileSize={20 * 1024 * 1024} // 20MB
  allowedFileTypes={[ProductFileType.PDF, ProductFileType.VIDEO]}
/>
```

### Product File Viewer

```jsx
import ProductFileViewer from '../components/ProductFileViewer';

// In your render method:
<ProductFileViewer
  url={file.url}
  type={file.fileType}
  name={file.originalName}
  thumbnailUrl={file.thumbnailUrl}
/>
```

## Switching Storage Providers

When you're ready to migrate from Firebase Storage to Cloudflare R2, follow these steps:

1. Configure your R2 credentials in the environment variables.

2. Use the migration utility to move files:

```typescript
import { StorageMigrator } from '../services/storageMigration';

// Create a migrator
const migrator = StorageMigrator.createFirebaseToR2Migrator({
  accountId: process.env.REACT_APP_R2_ACCOUNT_ID,
  accessKeyId: process.env.REACT_APP_R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_R2_SECRET_ACCESS_KEY,
  bucketName: process.env.REACT_APP_R2_BUCKET_NAME,
  customDomain: process.env.REACT_APP_R2_CUSTOM_DOMAIN,
});

// Migrate files with progress tracking
const results = await migrator.migrateFiles('products', (current, total) => {
  const progress = Math.round((current / total) * 100);
  console.log(`Migration progress: ${progress}%`);
});

console.log(`Migration complete: ${results.successful} successful, ${results.failed} failed`);

// Verify the migration
const validation = await migrator.validateMigration('products');
console.log(`Validation: ${validation.matchingFiles}/${validation.total} files migrated successfully`);
```

3. Switch the application to use R2:

```typescript
import { switchToR2Storage } from '../services/storageMigration';

// Switch to R2
switchToR2Storage({
  accountId: process.env.REACT_APP_R2_ACCOUNT_ID,
  accessKeyId: process.env.REACT_APP_R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_R2_SECRET_ACCESS_KEY,
  bucketName: process.env.REACT_APP_R2_BUCKET_NAME,
  customDomain: process.env.REACT_APP_R2_CUSTOM_DOMAIN,
});
```

4. Update your environment variables to set the default provider:

```
REACT_APP_STORAGE_PROVIDER=r2
```

## Configuration

All storage settings are centralized in `src/config/environment.ts`. You can override these settings using environment variables.

See `.env.example` for a list of all configurable options.

## Error Handling

The storage service includes comprehensive error handling. All methods will throw detailed error messages when operations fail, which you should catch and handle appropriately in your application code.

## Development Mode

In development mode, the system will default to using a mock storage provider unless explicitly configured otherwise. This allows for testing without actual cloud storage costs.

To use real storage in development, specify the provider in your `.env` file:

```
REACT_APP_STORAGE_PROVIDER=firebase
```
