export const env = {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    WS_URL: import.meta.env.VITE_WS_URL || 'http://localhost:8080',
    IS_DEV: import.meta.env.DEV,
} as const;