import * as supabaseStorage from './supabaseStorage';

// Singleton storageService to hold the current provider
class StorageServiceImpl implements StorageProvider {
  provider: StorageProvider;

  constructor(provider: StorageProvider) {
    this.provider = provider;
  }

  setProvider(provider: StorageProvider) {
    this.provider = provider;
  }

  async uploadFile(file: File, path: string): Promise<any> {
    return this.provider.uploadFile(file, path);
  }

  async getFileUrl(path: string): Promise<string> {
    return this.provider.getFileUrl(path);
  }

  async listFiles(prefix: string): Promise<string[]> {
    return this.provider.listFiles(prefix);
  }
}

// Default to supabase as the initial provider
const supabaseProvider: StorageProvider = {
  uploadFile: supabaseStorage.uploadFile,
  getFileUrl: async (path: string) => supabaseStorage.getPublicUrl(path),
  listFiles: async (prefix: string) => {
    // Supabase Storage: list files with a prefix
    const { data, error } = await supabaseStorage.supabase.storage
      .from(process.env.REACT_APP_SUPABASE_BUCKET!)
      .list(prefix, { limit: 1000, offset: 0, sortBy: { column: 'name', order: 'asc' } });
    if (error) throw error;
    if (!data) return [];
    // Flatten folders and files into a single array of paths
    const flatten = (items: any[], currentPrefix: string): string[] => {
      let files: string[] = [];
      for (const item of items) {
        if (item.id) {
          // File
          files.push(currentPrefix ? `${currentPrefix}/${item.name}` : item.name);
        } else if (item.name && item.items) {
          // Folder
          files = files.concat(flatten(item.items, currentPrefix ? `${currentPrefix}/${item.name}` : item.name));
        }
      }
      return files;
    };
    return flatten(data, prefix);
  }
};

export const storageService = new StorageServiceImpl(supabaseProvider);

// StorageProvider interface for pluggable storage backends
export interface StorageProvider {
  uploadFile(file: File, path: string): Promise<any>;
  getFileUrl(path: string): Promise<string>;
  listFiles(prefix: string): Promise<string[]>;
}

export async function uploadAnyFile(file: File, path: string) {
  return storageService.uploadFile(file, path);
}

export async function getFileUrl(path: string) {
  return storageService.getFileUrl(path);
}
