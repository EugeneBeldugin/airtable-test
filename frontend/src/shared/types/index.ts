export interface ApiResponse<T> {
    data: T;
    meta?: {
        total: number;
        fetchTime: number;
    };
}

export type ColumnType = 'text' | 'number' | 'boolean' | 'select' | 'date';

export interface ColumnConfig {
    key: string;
    label: string;
    type: ColumnType;
    width: number;
    editable?: boolean;
    selectOptionsKey?: string;
}