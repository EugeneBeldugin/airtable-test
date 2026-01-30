import { useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { totalWidth } from '../model/columns';
import type { Row, SelectOptions } from '../../../entities/row';
import styles from './DataTable.module.css';

interface DataTableProps {
    data: Row[];
    options: SelectOptions;
}

const ROW_HEIGHT = 40;

export function DataTable({ data, options }: DataTableProps) {
    const parentRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => ROW_HEIGHT,
        overscan: 5,
    });

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        if (headerRef.current) {
            headerRef.current.scrollLeft = e.currentTarget.scrollLeft;
        }
    }, []);

    return (
        <div className={styles.container}>
            <TableHeader ref={headerRef} />

            <div ref={parentRef} className={styles.body} onScroll={handleScroll}>
                <div
                    className={styles.virtualContainer}
                    style={{ height: rowVirtualizer.getTotalSize(), minWidth: totalWidth }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                        <TableRow
                            key={data[virtualRow.index].id}
                            row={data[virtualRow.index]}
                            index={virtualRow.index}
                            start={virtualRow.start}
                            options={options}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}