import { forwardRef } from 'react';
import { columns, totalWidth } from '../model/columns';
import styles from './TableHeader.module.css';

export const TableHeader = forwardRef<HTMLDivElement>((_, ref) => {
    return (
        <div className={styles.container} ref={ref}>
            <div className={styles.row} style={{ minWidth: totalWidth }}>
                {columns.map((column) => (
                    <div
                        key={column.key}
                        className={styles.cell}
                        style={{ width: column.width, minWidth: column.width, maxWidth: column.width }}
                    >
                        {column.label}
                    </div>
                ))}
            </div>
        </div>
    );
});

TableHeader.displayName = 'TableHeader';