/**
 * Configuration file for environment-specific settings
 *
 * API_URL can be set via NEXT_PUBLIC_API_URL environment variable
 * Default: http://localhost:3000 for development
 */

// Remove trailing slash if exists to prevent double slashes in URLs
// Also handle empty string case
const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:3000";
export const API_URL = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

/**
 * Example usage in components:
 *
 * import { API_URL } from '@/lib/config';
 *
 * const response = await fetch(`${API_URL}/jobs`);
 */
