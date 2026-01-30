import type { BadgeVariant } from '../../../shared/ui';

export function getStatusVariant(status: string): BadgeVariant {
    const map: Record<string, BadgeVariant> = {
        active: 'success',
        inactive: 'error',
        pending: 'warning',
        archived: 'default',
    };
    return map[status] || 'default';
}

export function getPriorityVariant(priority: string): BadgeVariant {
    const map: Record<string, BadgeVariant> = {
        critical: 'error',
        high: 'warning',
        medium: 'info',
        low: 'default',
    };
    return map[priority] || 'default';
}

export function formatSalary(value: number | null): string {
    if (value === null) return '—';
    return `$${value.toLocaleString()}`;
}

export function formatDate(value: string | null): string {
    if (!value) return '—';
    return new Date(value).toLocaleDateString();
}