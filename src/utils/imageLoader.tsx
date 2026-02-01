// src/utils/imageLoader.ts

/**
 * Get the correct URL for an image, handling both local and external sources
 * @param src - The image source path
 * @returns The resolved image URL
 */
export function getImageUrl(src: string): string {
  // External URLs - return as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // Local images from public folder
  // These are served directly and paths are preserved in the build
  // Just return the path as-is - Vite will handle the base path automatically
  return src;
}