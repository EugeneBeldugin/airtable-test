import { apiClient } from '../../../shared/api/client';
import type { ApiResponse } from '../../../shared/types';
import type { Row, SelectOptions, UpdateRowParams } from '../model/types';

export const rowApi = {
    getAll: () =>
        apiClient.get<ApiResponse<Row[]>>('/api/rows'),
    getOptions: () =>
        apiClient.get<SelectOptions>('/api/rows/options'),
    update: ({ id, column, value }: UpdateRowParams) =>
        apiClient.patch<{ data: Row }>(`/api/rows/${id}`, { column, value })
};