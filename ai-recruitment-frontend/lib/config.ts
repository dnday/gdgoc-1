/**
 * Configuration file for environment-specific settings
 *
 * API_URL can be set via NEXT_PUBLIC_API_URL environment variable
 * Default: http://localhost:3000 for development
 */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Example usage in components:
 *
 * import { API_URL } from '@/lib/config';
 *
 * const response = await fetch(`${API_URL}/jobs`);
 */
