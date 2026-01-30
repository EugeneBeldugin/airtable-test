import { FastifyInstance } from 'fastify';
import { Server } from 'socket.io';
import { pool } from '../db/connection.js';
import { STATUSES, PRIORITIES, DEPARTMENTS, CATEGORIES } from '../db/seed.js';

const ALLOWED_COLUMNS = [
    'name', 'email', 'company', 'department', 'job_title',
    'salary', 'age', 'country', 'city', 'status',
    'priority', 'category', 'tags', 'notes', 'website',
    'phone', 'start_date', 'is_active', 'rating'
] as const;

type RowColumn = (typeof ALLOWED_COLUMNS)[number];

const DEFAULT_ROW: Partial<Record<RowColumn, any>> = {
    name: 'New Row',
    department: 'Engineering',
    status: 'active',
    priority: 'medium',
    category: 'A',
    is_active: true,
};

let io: Server | null = null;

export const setSocketIO = (socketIO: Server) => { io = socketIO; };

const emit = (event: string, data: any) => io?.emit(event, data);

export async function rowsRoutes(fastify: FastifyInstance): Promise<void> {
    fastify.get('/rows', async () => {
        const { rows } = await pool.query('SELECT * FROM rows ORDER BY id ASC');
        return { data: rows, meta: { total: rows.length } };
    });

    fastify.get('/rows/options', async () => ({
        status: STATUSES,
        priority: PRIORITIES,
        department: DEPARTMENTS,
        category: CATEGORIES,
    }));

    fastify.get<{ Params: { id: string } }>('/rows/:id', async (req, reply) => {
        const { rows } = await pool.query('SELECT * FROM rows WHERE id = $1', [req.params.id]);
        return rows[0] ? { data: rows[0] } : reply.status(404).send({ error: 'Row not found' });
    });

    fastify.patch<{ Params: { id: string }; Body: { column: string; value: any } }>(
        '/rows/:id',
        async (req, reply) => {
            const { id } = req.params;
            const { column, value } = req.body;

            if (!ALLOWED_COLUMNS.includes(column as RowColumn)) {
                return reply.status(400).send({ error: `Invalid column: ${column}` });
            }

            const { rows } = await pool.query(
                `UPDATE rows SET ${column} = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
                [value, id]
            );

            if (!rows[0]) return reply.status(404).send({ error: 'Row not found' });

            emit('row:updated', { id: +id, column, value, updatedAt: rows[0].updated_at });
            return { success: true, data: rows[0] };
        }
    );

    fastify.post<{ Body: Partial<Record<string, any>> }>('/rows', async (req, reply) => {
        const body = { ...DEFAULT_ROW, ...req.body };
        const columns = ALLOWED_COLUMNS.filter((col) => body[col] !== undefined);
        const values = columns.map((col) => body[col]);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

        const { rows } = await pool.query(
            `INSERT INTO rows (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`,
            values
        );

        emit('row:created', rows[0]);
        return reply.status(201).send({ success: true, data: rows[0] });
    });

    fastify.delete<{ Params: { id: string } }>('/rows/:id', async (req, reply) => {
        const { rows } = await pool.query('DELETE FROM rows WHERE id = $1 RETURNING id', [req.params.id]);
        if (!rows[0]) return reply.status(404).send({ error: 'Row not found' });

        emit('row:deleted', { id: +req.params.id });
        return { success: true, id: +req.params.id };
    });
}