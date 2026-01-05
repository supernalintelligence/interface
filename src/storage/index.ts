/**
 * Storage System - Index File
 * 
 * Exports storage adapters and StateManager
 * 
 * NOTE: FileStorageAdapter is NOT exported here to avoid Node.js dependencies (fs/promises)
 * in browser bundles. Import it directly if needed in Node.js environments:
 * import { FileStorageAdapter } from '@supernal/interface-core/dist/esm/src/storage/FileStorageAdapter';
 */

// Export browser-safe adapters
export { 
  StorageAdapter,
  LocalStorageAdapter,
  ChromeStorageAdapter,
  MemoryStorageAdapter 
} from './StorageAdapter';

// Export StateManager
export * from './StateManager';

// DO NOT export FileStorageAdapter here - it contains fs/promises
// For Node.js usage, import directly:
// import { FileStorageAdapter } from '@supernal/interface-core/dist/esm/src/storage/FileStorageAdapter';

