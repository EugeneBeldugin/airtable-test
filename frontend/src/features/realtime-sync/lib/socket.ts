import { io, Socket } from 'socket.io-client';
import { env } from '../../../shared/config/env';

export const socket: Socket = io(env.WS_URL, {
    autoConnect: false,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
});

export function connectSocket(): void {
    if (!socket.connected) {
        socket.connect();
    }
}

export function disconnectSocket(): void {
    if (socket.connected) {
        socket.disconnect();
    }
}

export function emitCellEditing(rowId: number, column: string): void {
    socket.emit('cell:editing', { rowId, column });
}

export function emitCellStoppedEditing(rowId: number, column: string): void {
    socket.emit('cell:stopped-editing', { rowId, column });
}