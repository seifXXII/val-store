/**
 * File Upload Service Interface
 *
 * Defines the contract for file upload operations.
 * Implementation can use Cloudflare R2, AWS S3, Cloudinary, etc.
 */

export interface UploadResult {
  /** Unique identifier for the uploaded file */
  key: string;
  /** Public URL to access the file */
  url: string;
  /** File size in bytes */
  size: number;
  /** MIME type of the file */
  mimeType: string;
  /** Original filename */
  fileName: string;
}

export interface UploadOptions {
  /** Target folder/prefix for the file */
  folder?: string;
  /** Custom filename (otherwise uses original name) */
  fileName?: string;
  /** Max file size in bytes */
  maxSize?: number;
  /** Allowed MIME types */
  allowedTypes?: string[];
}

export interface FileUploadServiceInterface {
  /**
   * Upload a file to storage
   * @param file - Base64 encoded file data or Buffer
   * @param options - Upload options
   * @returns Upload result with URL and metadata
   */
  uploadFile(
    file: Buffer | string,
    fileName: string,
    mimeType: string,
    options?: UploadOptions
  ): Promise<UploadResult>;

  /**
   * Upload multiple files
   * @param files - Array of file data with metadata
   * @param options - Upload options
   * @returns Array of upload results
   */
  uploadFiles(
    files: Array<{ data: Buffer | string; fileName: string; mimeType: string }>,
    options?: UploadOptions
  ): Promise<UploadResult[]>;

  /**
   * Delete a file from storage
   * @param key - File key/path to delete
   */
  deleteFile(key: string): Promise<void>;

  /**
   * Delete multiple files
   * @param keys - Array of file keys to delete
   */
  deleteFiles(keys: string[]): Promise<void>;

  /**
   * Get signed URL for private file access
   * @param key - File key
   * @param expiresIn - Expiration time in seconds
   * @returns Signed URL
   */
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;

  /**
   * Check if a file exists
   * @param key - File key to check
   */
  exists(key: string): Promise<boolean>;
}

/**
 * Validation helper types
 */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
