import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socket, connectSocket } from '../lib/socket';
import { rowKeys } from '../../../entities/row';
import type { Row } from '../../../entities/row';
import type { ApiResponse } from '../../../shared/types';

interface RowUpdatedEvent {
    id: number;
    column: string;
    value: string | number | boolean | null;
    updatedAt: string;
}

interface ServerInfo {
    serverId: string;
    socketId: string;
    connectedAt: string;
}

export function useRealtimeSync() {
    const queryClient = useQueryClient();
    const [isConnected, setIsConnected] = useState(false);
    const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);

    useEffect(() => {
        connectSocket();

        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);
        const onServerInfo = (info: ServerInfo) => setServerInfo(info);

        const onRowUpdated = (event: RowUpdatedEvent) => {
            queryClient.setQueryData<ApiResponse<Row[]>>(rowKeys.all, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    data: old.data.map((row) =>
                        row.id === event.id
                            ? { ...row, [event.column]: event.value, updated_at: event.updatedAt }
                            : row
                    ),
                };
            });
        };

        const onRowCreated = (newRow: Row) => {
            queryClient.setQueryData<ApiResponse<Row[]>>(rowKeys.all, (old) => {
                if (!old) return old;
                return { ...old, data: [...old.data, newRow] };
            });
        };

        const onRowDeleted = ({ id }: { id: number }) => {
            queryClient.setQueryData<ApiResponse<Row[]>>(rowKeys.all, (old) => {
                if (!old) return old;
                return { ...old, data: old.data.filter((row) => row.id !== id) };
            });
        };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('server:info', onServerInfo);
        socket.on('row:updated', onRowUpdated);
        socket.on('row:created', onRowCreated);
        socket.on('row:deleted', onRowDeleted);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('server:info', onServerInfo);
            socket.off('row:updated', onRowUpdated);
            socket.off('row:created', onRowCreated);
            socket.off('row:deleted', onRowDeleted);
        };
    }, [queryClient]);

    return { isConnected, serverInfo };
}