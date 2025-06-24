/**
 * Create a standardized API response
 */
export function createApiResponse(data, message) {
    return {
        data,
        message,
        status: "success",
    };
}
/**
 * Create a standardized API error
 */
export function createApiError(message, code, details) {
    return {
        message,
        code,
        details,
    };
}
/**
 * Generate a unique ID
 */
export function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}
/**
 * Validate email format
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Validate URL format
 */
export function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Sanitize string input
 */
export function sanitizeString(input) {
    return input.trim().replace(/[<>]/g, "");
}
/**
 * Convert string to slug
 */
export function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
/**
 * Deep clone an object
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => deepClone(item));
    }
    const cloned = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}
/**
 * Debounce function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
/**
 * Throttle function
 */
export function throttle(func, wait) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), wait);
        }
    };
}
/**
 * Format date to ISO string
 */
export function formatDateToISO(date) {
    return date.toISOString();
}
/**
 * Parse ISO date string
 */
export function parseISODate(dateString) {
    return new Date(dateString);
}
/**
 * Check if value is empty
 */
export function isEmpty(value) {
    if (value == null)
        return true;
    if (typeof value === "string")
        return value.trim().length === 0;
    if (Array.isArray(value))
        return value.length === 0;
    if (typeof value === "object")
        return Object.keys(value).length === 0;
    return false;
}
/**
 * Safe JSON parse
 */
export function safeJsonParse(json, defaultValue) {
    try {
        return JSON.parse(json);
    }
    catch {
        return defaultValue;
    }
}
/**
 * Safe JSON stringify
 */
export function safeJsonStringify(obj) {
    try {
        return JSON.stringify(obj);
    }
    catch {
        return "{}";
    }
}
/**
 * Calculate pagination offset
 */
export function calculateOffset(page, limit) {
    return (page - 1) * limit;
}
/**
 * Calculate total pages
 */
export function calculateTotalPages(total, limit) {
    return Math.ceil(total / limit);
}
/**
 * Validate pagination parameters
 */
export function validatePaginationParams(page, limit) {
    const validatedPage = Math.max(1, page || 1);
    const validatedLimit = Math.min(Math.max(1, limit || 20), 100);
    return {
        page: validatedPage,
        limit: validatedLimit,
    };
}
/**
 * Format file size
 */
export function formatFileSize(bytes) {
    if (bytes === 0)
        return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
/**
 * Generate color from string
 */
export function generateColorFromString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
}
