import { env } from "./env";

/**
 * Generate public S3 URL from key (synchronous fallback)
 * @param key - S3 object key
 * @returns Public URL to access the S3 object
 */
export function getS3PublicUrl(key: string): string {
  if (!key) return "";

  // Remove any leading slashes
  const cleanKey = key.startsWith("/") ? key.slice(1) : key;

  // Get bucket name from environment (client-side accessible)
  const bucketName = env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES;

  if (!bucketName) {
    console.error("NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES not found");
    return "";
  }

  // Use Tigris storage format consistently
  return `https://${bucketName}.fly.storage.tigris.dev/${cleanKey}`;
}

/**
 * Check if a URL is a valid S3 key (not a full URL)
 * @param value - The value to check
 * @returns true if it's a key, false if it's already a URL
 */
export function isS3Key(value: string): boolean {
  if (!value) return false;
  return (
    !value.startsWith("http://") &&
    !value.startsWith("https://") &&
    !value.startsWith("blob:")
  );
}
