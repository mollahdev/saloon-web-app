import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_ID = process.env.R2_BUCKET_ACCESS_KEY_ID || process.env.R2_ACCESS_ID || '';
const R2_SECRET_KEY = process.env.R2_BUCKET_SECRET_ACCESS_KEY || process.env.R2_SECRET_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || '';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

// Initialize S3 client for Cloudflare R2
export const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_ID,
        secretAccessKey: R2_SECRET_KEY,
    },
});

/**
 * Constructs the public URL for an R2 object key
 * @param key - The key of the object
 * @returns The public URL
 */
export function getPublicUrl(key: string): string {
    if (!R2_PUBLIC_URL) {
        // Fallback to standard endpoint representation if public CDN URL is not set
        return `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;
    }

    const baseUrl = R2_PUBLIC_URL.endsWith('/') ? R2_PUBLIC_URL.slice(0, -1) : R2_PUBLIC_URL;
    return `${baseUrl}/${key}`;
}

/**
 * Uploads a file (Buffer, Uint8Array, or Blob) to Cloudflare R2
 * @param file - The file content
 * @param key - The destination key (file path) in the bucket
 * @param contentType - The MIME type of the file (e.g., 'image/jpeg')
 * @returns The public URL of the uploaded file
 */
export async function uploadImage(
    file: Buffer | Uint8Array | Blob | ReadableStream | string,
    key: string,
    contentType: string
): Promise<string> {
    if (!R2_BUCKET_NAME) {
        throw new Error('R2_BUCKET_NAME is not configured');
    }

    const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: contentType,
    });

    await r2Client.send(command);

    return getPublicUrl(key);
}

/**
 * Deletes a file from Cloudflare R2
 * @param key - The key (file path) of the file to delete
 */
export async function deleteImage(key: string): Promise<void> {
    if (!R2_BUCKET_NAME) {
        throw new Error('R2_BUCKET_NAME is not configured');
    }

    const command = new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
    });

    await r2Client.send(command);
}
