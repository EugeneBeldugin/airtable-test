export interface Row {
    id: number;
    name: string;
    email: string | null;
    company: string | null;
    department: string;
    job_title: string | null;
    salary: number | null;
    age: number | null;
    country: string | null;
    city: string | null;
    status: string;
    priority: string;
    category: string;
    tags: string | null;
    notes: string | null;
    website: string | null;
    phone: string | null;
    start_date: string | null;
    is_active: boolean;
    rating: number | null;
    created_at: string;
    updated_at: string;
}

export interface SelectOptions {
    status: string[];
    priority: string[];
    department: string[];
    category: string[];
}

export interface UpdateRowParams {
    id: number;
    column: keyof Row;
    value: string | number | boolean | null;
}