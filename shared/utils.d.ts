import { ApiResponse, ApiError } from "./types";
/**
 * Create a standardized API response
 */
export declare function createApiResponse<T>(data: T, message?: string): ApiResponse<T>;
/**
 * Create a standardized API error
 */
export declare function createApiError(message: string, code?: string, details?: any): ApiError;
/**
 * Generate a unique ID
 */
export declare function generateId(): string;
/**
 * Validate email format
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Validate URL format
 */
export declare function isValidUrl(url: string): boolean;
/**
 * Sanitize string input
 */
export declare function sanitizeString(input: string): string;
/**
 * Convert string to slug
 */
export declare function slugify(text: string): string;
/**
 * Deep clone an object
 */
export declare function deepClone<T>(obj: T): T;
/**
 * Debounce function
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Throttle function
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Format date to ISO string
 */
export declare function formatDateToISO(date: Date): string;
/**
 * Parse ISO date string
 */
export declare function parseISODate(dateString: string): Date;
/**
 * Check if value is empty
 */
export declare function isEmpty(value: any): boolean;
/**
 * Safe JSON parse
 */
export declare function safeJsonParse<T>(json: string, defaultValue: T): T;
/**
 * Safe JSON stringify
 */
export declare function safeJsonStringify(obj: any): string;
/**
 * Calculate pagination offset
 */
export declare function calculateOffset(page: number, limit: number): number;
/**
 * Calculate total pages
 */
export declare function calculateTotalPages(total: number, limit: number): number;
/**
 * Validate pagination parameters
 */
export declare function validatePaginationParams(page?: number, limit?: number): {
    page: number;
    limit: number;
};
/**
 * Format file size
 */
export declare function formatFileSize(bytes: number): string;
/**
 * Generate color from string
 */
export declare function generateColorFromString(str: string): string;
