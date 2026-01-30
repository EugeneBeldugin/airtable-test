import { memo } from 'react';
import { EditableCell } from '../../../features/edit-cell';
import { columns } from '../model/columns';
import type { Row, SelectOptions } from '../../../entities/row';
import styles from './TableRow.module.css';

interface TableRowProps {
    row: Row;
    index: number;
    start: number;
    options: SelectOptions;
}

export const TableRow = memo(function TableRow({ row, index, start, options }: TableRowProps) {
    return (
        <div
            className={`${styles.row} ${index % 2 === 0 ? styles.even : styles.odd}`}
            style={{ transform: `translateY(${start}px)` }}
        >
            {columns.map((column) => (
                <EditableCell
                    key={column.key}
                    row={row}
                    column={column}
                    options={options}
                />
            ))}
        </div>
    );
});