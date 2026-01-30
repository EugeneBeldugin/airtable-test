import type { ColumnConfig } from '../../../shared/types';

export const columns: ColumnConfig[] = [
    { key: 'id', label: 'ID', type: 'number', width: 70, editable: false },
    { key: 'name', label: 'Name', type: 'text', width: 180 },
    { key: 'email', label: 'Email', type: 'text', width: 220 },
    { key: 'company', label: 'Company', type: 'text', width: 180 },
    { key: 'department', label: 'Department', type: 'select', width: 130, selectOptionsKey: 'department' },
    { key: 'job_title', label: 'Job Title', type: 'text', width: 180 },
    { key: 'salary', label: 'Salary', type: 'number', width: 110 },
    { key: 'age', label: 'Age', type: 'number', width: 70 },
    { key: 'country', label: 'Country', type: 'text', width: 140 },
    { key: 'city', label: 'City', type: 'text', width: 130 },
    { key: 'status', label: 'Status', type: 'select', width: 110, selectOptionsKey: 'status' },
    { key: 'priority', label: 'Priority', type: 'select', width: 110, selectOptionsKey: 'priority' },
    { key: 'category', label: 'Category', type: 'select', width: 100, selectOptionsKey: 'category' },
    { key: 'tags', label: 'Tags', type: 'text', width: 150 },
    { key: 'notes', label: 'Notes', type: 'text', width: 200 },
    { key: 'website', label: 'Website', type: 'text', width: 180 },
    { key: 'phone', label: 'Phone', type: 'text', width: 140 },
    { key: 'start_date', label: 'Start Date', type: 'date', width: 120 },
    { key: 'is_active', label: 'Active', type: 'boolean', width: 80 },
    { key: 'rating', label: 'Rating', type: 'number', width: 80 },
];

export const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);