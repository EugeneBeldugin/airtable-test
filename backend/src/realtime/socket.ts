import { Server } from 'socket.io';

export function setupSocketHandlers(io: Server): void {
    io.on('connection', (socket) => {
        socket.emit('server:info', { socketId: socket.id, connectedAt: new Date().toISOString() });

        socket.on('table:join', (tableId = 'main') => socket.join(`table:${tableId}`));
        socket.on('table:leave', (tableId = 'main') => socket.leave(`table:${tableId}`));

        socket.on('cell:editing', (data: { rowId: number; column: string }) => {
            socket.broadcast.emit('cell:editing', { ...data, socketId: socket.id });
        });

        socket.on('cell:stopped-editing', (data: { rowId: number; column: string }) => {
            socket.broadcast.emit('cell:stopped-editing', { ...data, socketId: socket.id });
        });

        socket.on('ping', (callback) => {
            if (typeof callback === 'function') callback({ timestamp: Date.now() });
        });

        socket.on('disconnect', () => {
            socket.broadcast.emit('user:disconnected', { socketId: socket.id });
        });
    });
}