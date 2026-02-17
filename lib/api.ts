/**
 * API Fetch Template
 * This module provides a reusable API fetch utility for your Next.js application
 */

interface RequestOptions extends RequestInit {
    params?: Record<string, string | number | boolean>;
    timeout?: number;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    code?: number;
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

/**
 * Build query string from params object
 */
function buildQueryString(
    params: Record<string, string | number | boolean> | undefined
): string {
    if (!params) return "";
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
    });
    return searchParams.toString();
}

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        return response;
    } finally {
        clearTimeout(timeoutId);
    }
}

/**
 * Generic API request handler
 * @param endpoint - API endpoint path (e.g., '/users', '/posts/1')
 * @param options - Request options (method, headers, body, params, timeout)
 * @returns Promise with typed response
 */
export async function apiRequest<T = any>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<ApiResponse<T>> {
    const {
        params,
        timeout = DEFAULT_TIMEOUT,
        headers = {},
        ...fetchOptions
    } = options;

    try {
        // Build URL with query params
        const queryString = buildQueryString(params);
        const url = new URL(endpoint, API_BASE_URL);
        if (queryString) {
            url.search = queryString;
        }

        // Set default headers
        const finalHeaders = {
            "Content-Type": "application/json",
            ...headers,
        };

        // Make request with timeout
        const response = await fetchWithTimeout(
            url.toString(),
            {
                ...fetchOptions,
                headers: finalHeaders,
            },
            timeout
        );

        // Handle non-200 responses
        if (!response.ok) {
            const error = await response.text();
            return {
                success: false,
                error: error || `HTTP ${response.status}`,
                code: response.status,
            };
        }

        // Parse response
        const data = await response.json();
        return {
            success: true,
            data,
            code: response.status,
        };
    } catch (err) {
        const error = err instanceof Error ? err.message : "Unknown error";
        return {
            success: false,
            error,
            code: 0,
        };
    }
}

/**
 * GET request
 */
export function apiGet<T = any>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">
): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
        ...options,
        method: "GET",
    });
}

/**
 * POST request
 */
export function apiPost<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method" | "body">
): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
        ...options,
        method: "POST",
        body: JSON.stringify(body),
    });
}

/**
 * PUT request
 */
export function apiPut<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method" | "body">
): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
        ...options,
        method: "PUT",
        body: JSON.stringify(body),
    });
}

/**
 * PATCH request
 */
export function apiPatch<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method" | "body">
): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
        ...options,
        method: "PATCH",
        body: JSON.stringify(body),
    });
}

/**
 * DELETE request
 */
export function apiDelete<T = any>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">
): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
        ...options,
        method: "DELETE",
    });
}

export default {
    request: apiRequest,
    get: apiGet,
    post: apiPost,
    put: apiPut,
    patch: apiPatch,
    delete: apiDelete,
};
