import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rowApi } from './rowApi';
import type { ApiResponse } from '../../../shared/types';
import type { Row, UpdateRowParams } from '../model/types';

export const rowKeys = {
    all: ['rows'] as const,
    options: ['rows', 'options'] as const
}

export function useRows() {
    return useQuery({
        queryKey: rowKeys.all,
        queryFn: rowApi.getAll
    });
}

export function useSelectOptions() {
    return useQuery({
        queryKey: rowKeys.options,
        queryFn: rowApi.getOptions,
        staleTime: Infinity
    });
}

export function useUpdateRow() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: rowApi.update,
        onMutate: async ({ id, column, value }: UpdateRowParams) => {
            await queryClient.cancelQueries({ queryKey: rowKeys.all });

            const previous = queryClient.getQueryData<ApiResponse<Row[]>>(rowKeys.all);


            queryClient.setQueryData<ApiResponse<Row[]>>(rowKeys.all, (old) => {
                if (!old) return old;

                return {
                    ...old,
                    data: old.data.map((row) => row.id === id ? { ...row, [column]: value } : row)
                }
            });

            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(rowKeys.all, context.previous)
            }
        }
    });
}