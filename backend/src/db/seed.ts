import pg from 'pg';
import { faker } from '@faker-js/faker';

export const STATUSES = ['active', 'inactive', 'pending', 'archived'];
export const PRIORITIES = ['low', 'medium', 'high', 'critical'];
export const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Legal', 'Support'];
export const CATEGORIES = ['A', 'B', 'C', 'D', 'E'];

const COLUMNS = [
    'name', 'email', 'company', 'department', 'job_title',
    'salary', 'age', 'country', 'city', 'status',
    'priority', 'category', 'tags', 'notes', 'website',
    'phone', 'start_date', 'is_active', 'rating'
];

function generateRow() {
    return [
        faker.person.fullName(),
        faker.internet.email(),
        faker.company.name(),
        faker.helpers.arrayElement(DEPARTMENTS),
        faker.person.jobTitle(),
        faker.number.float({ min: 30000, max: 200000, fractionDigits: 2 }),
        faker.number.int({ min: 22, max: 65 }),
        faker.location.country(),
        faker.location.city(),
        faker.helpers.arrayElement(STATUSES),
        faker.helpers.arrayElement(PRIORITIES),
        faker.helpers.arrayElement(CATEGORIES),
        faker.helpers.arrayElements(['important', 'review', 'urgent', 'follow-up', 'new'], { min: 0, max: 3 }).join(','),
        faker.lorem.sentence(),
        faker.internet.url(),
        faker.phone.number(),
        faker.date.past({ years: 5 }),
        faker.datatype.boolean(),
        faker.number.float({ min: 1, max: 5, fractionDigits: 2 }),
    ];
}

export async function seed(connectionString?: string): Promise<void> {
    const pool = new pg.Pool({
        connectionString: connectionString || process.env.DATABASE_URL,
    });

    const TOTAL_ROWS = 50_000;
    const BATCH_SIZE = 1000;

    try {
        await pool.query('TRUNCATE TABLE rows RESTART IDENTITY CASCADE');

        for (let batch = 0; batch < TOTAL_ROWS / BATCH_SIZE; batch++) {
            const values: any[] = [];
            const placeholders: string[] = [];

            for (let i = 0; i < BATCH_SIZE; i++) {
                const row = generateRow();
                const offset = i * COLUMNS.length;
                placeholders.push(`(${COLUMNS.map((_, j) => `$${offset + j + 1}`).join(', ')})`);
                values.push(...row);
            }

            await pool.query(
                `INSERT INTO rows (${COLUMNS.join(', ')}) VALUES ${placeholders.join(', ')}`,
                values
            );
        }
    } finally {
        await pool.end();
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    seed().catch(console.error);
}