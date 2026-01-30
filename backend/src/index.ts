import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { pool, initDatabase } from './db/connection.js';
import { rowsRoutes, setSocketIO } from './routes/rows.js';
import { setupSocketHandlers } from './realtime/socket.js';

const PORT = parseInt(process.env.PORT || '3000');

async function bootstrap() {
    const fastify = Fastify({ logger: true });

    await fastify.register(cors, { origin: true, credentials: true });
    await initDatabase();

    const client = await pool.connect();
    try {
        const { rows: [{ locked }] } = await client.query('SELECT pg_try_advisory_lock(12345) as locked');
        const { rows: [{ count }] } = await client.query('SELECT COUNT(*) as count FROM rows');

        if (parseInt(count) === 0 && locked) {
            const { seed } = await import('./db/seed.js');
            await seed(process.env.DATABASE_URL);
            await client.query('SELECT pg_advisory_unlock(12345)');
        }
    } finally {
        client.release();
    }

    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);

    await fastify.register(rowsRoutes, { prefix: '/api' });

    fastify.get('/api/health', async () => ({
        status: 'ok',
        timestamp: new Date().toISOString(),
    }));

    await fastify.listen({ port: PORT, host: '0.0.0.0' });

    const io = new Server(fastify.server, {
        cors: { origin: true, credentials: true },
        adapter: createAdapter(pubClient, subClient),
    });

    setSocketIO(io);
    setupSocketHandlers(io);

    const shutdown = async () => {
        await pubClient.quit();
        await subClient.quit();
        await pool.end();
        await fastify.close();
        process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}

bootstrap().catch(() => process.exit(1));