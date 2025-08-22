import { StorageProvider, storageService } from './storageService';
import { createR2Provider } from './r2Storage';

/**
 * Migration utility to help move files between storage providers
 */
export class StorageMigrator {
  private sourceProvider: StorageProvider;
  private targetProvider: StorageProvider;
  
  constructor(
    sourceProvider: StorageProvider,
    targetProvider: StorageProvider
  ) {
    this.sourceProvider = sourceProvider;
    this.targetProvider = targetProvider;
  }
  
  /**
   * Factory method to create a migrator for Firebase to R2
   */
  static createFirebaseToR2Migrator(r2Config: {
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
    customDomain?: string;
  }): StorageMigrator {
    const r2Provider = createR2Provider(r2Config);
    return new StorageMigrator(storageService['provider'], r2Provider);
  }
  
  /**
   * Migrate a single file from source to target provider
   */
  async migrateFile(path: string): Promise<{ success: boolean; sourceUrl: string; targetUrl: string }> {
    try {
      // Get the file from source provider
      const sourceUrl = await this.sourceProvider.getFileUrl(path);
      
      // Fetch the file content
      const response = await fetch(sourceUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file from source: ${response.statusText}`);
      }
      
      // Convert to File object
      const blob = await response.blob();
      const fileName = path.split('/').pop() || 'migrated-file';
      const file = new File([blob], fileName, { type: blob.type });
      
      // Upload to target provider
      const targetUrl = await this.targetProvider.uploadFile(file, path);
      
      return {
        success: true,
        sourceUrl,
        targetUrl
      };
    } catch (error) {
      console.error(`Failed to migrate file ${path}:`, error);
      throw error;
    }
  }
  
  /**
   * Migrate all files with a given prefix
   */
  async migrateFiles(prefix: string, onProgress?: (current: number, total: number) => void): Promise<{
    successful: number;
    failed: number;
    details: Array<{ path: string; success: boolean; error?: string }>
  }> {
    try {
      // List all files from source
      const filePaths = await this.sourceProvider.listFiles(prefix);
      const total = filePaths.length;
      
      console.log(`Found ${total} files to migrate with prefix: ${prefix}`);
      
      const results = {
        successful: 0,
        failed: 0,
        details: [] as Array<{ path: string; success: boolean; error?: string }>
      };
      
      // Migrate each file
      for (let i = 0; i < filePaths.length; i++) {
        const path = filePaths[i];
        try {
          await this.migrateFile(path);
          
          results.successful++;
          results.details.push({
            path,
            success: true
          });
        } catch (error) {
          results.failed++;
          results.details.push({
            path,
            success: false,
            error: (error as Error).message
          });
        }
        
        // Report progress
        if (onProgress) {
          onProgress(i + 1, total);
        }
      }
      
      return results;
    } catch (error) {
      console.error(`Failed to migrate files with prefix ${prefix}:`, error);
      throw error;
    }
  }
  
  /**
   * Validate migration by checking if files exist in both providers
   */
  async validateMigration(prefix: string): Promise<{
    total: number;
    matchingFiles: number;
    missingFiles: string[];
  }> {
    const sourceFiles = await this.sourceProvider.listFiles(prefix);
    const targetFiles = await this.targetProvider.listFiles(prefix);
    
    const sourceSet = new Set(sourceFiles);
    const targetSet = new Set(targetFiles);
    
    const missingFiles = sourceFiles.filter(file => !targetSet.has(file));
    
    return {
      total: sourceFiles.length,
      matchingFiles: sourceFiles.length - missingFiles.length,
      missingFiles
    };
  }
}

/**
 * Simplified helper to switch storage provider 
 */
export function switchToR2Storage(r2Config: {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  customDomain?: string;
}): void {
  // 1. Create the R2 provider
  const r2Provider = createR2Provider(r2Config);
  
  // 2. Update the environment configuration
  localStorage.setItem('STORAGE_PROVIDER', 'r2');
  
  // 3. Set the provider in the storage service
  (storageService as any).setProvider(r2Provider);
  
  console.log('Successfully switched to Cloudflare R2 storage provider');
}
