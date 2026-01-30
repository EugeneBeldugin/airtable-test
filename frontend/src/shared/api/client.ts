import { env } from '../config/env';

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`);

        if (!response.ok) {
            throw new Error(`GET ${endpoint} failed: ${response.statusText}`);
        }

        return response.json();
    }

    async patch<T>(endpoint: string, data: unknown): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error(`PATCH ${endpoint} failed: ${response.statusText}`);
        }

        return response.json();
    }
}

export const apiClient = new ApiClient(env.API_URL);