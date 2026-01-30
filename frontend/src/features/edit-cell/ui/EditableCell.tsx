import { memo } from 'react';
import { useEditCell } from '../model/useEditCell';
import { TextEditor, NumberEditor, SelectEditor, DateEditor, BooleanEditor } from './editors';
import { Badge } from '../../../shared/ui';
import { getStatusVariant, getPriorityVariant, formatSalary, formatDate } from '../../../entities/row';
import type { Row, SelectOptions } from '../../../entities/row';
import type { ColumnConfig } from '../../../shared/types';
import styles from './EditableCell.module.css';

interface EditableCellProps {
    row: Row;
    column: ColumnConfig;
    options: SelectOptions;
    onEditStart?: () => void;
    onEditEnd?: () => void;
}

export const EditableCell = memo(function EditableCell({
                                                           row,
                                                           column,
                                                           options,
                                                           onEditStart,
                                                           onEditEnd,
                                                       }: EditableCellProps) {
    const {
        isEditing,
        editValue,
        inputRef,
        value,
        startEditing,
        saveChanges,
        setEditValue,
        handleKeyDown,
        handleBooleanChange,
    } = useEditCell({ row, column, onEditStart, onEditEnd });

    const renderValue = () => {
        if (value === null || value === undefined) {
            return <span className={styles.empty}>—</span>;
        }

        if (column.type === 'boolean') {
            return <span>{value ? '✓' : '✗'}</span>;
        }

        if (column.key === 'salary') {
            return <span>{formatSalary(value as number)}</span>;
        }

        if (column.type === 'date') {
            return <span>{formatDate(value as string)}</span>;
        }

        if (column.key === 'status') {
            return <Badge variant={getStatusVariant(value as string)}>{value}</Badge>;
        }

        if (column.key === 'priority') {
            return <Badge variant={getPriorityVariant(value as string)}>{value}</Badge>;
        }

        return <span>{String(value)}</span>;
    };

    const renderEditor = () => {
        if (column.type === 'boolean') {
            return (
                <BooleanEditor
                    checked={editValue === 'true'}
                    onChange={handleBooleanChange}
                    inputRef={inputRef as React.RefObject<HTMLInputElement>}
                />
            );
        }

        if (column.type === 'select' && column.selectOptionsKey) {
            return (
                <SelectEditor
                    value={editValue}
                    options={options[column.selectOptionsKey as keyof SelectOptions]}
                    onChange={setEditValue}
                    onBlur={saveChanges}
                    onKeyDown={handleKeyDown}
                    inputRef={inputRef as React.RefObject<HTMLSelectElement>}
                />
            );
        }

        if (column.type === 'number') {
            return (
                <NumberEditor
                    value={editValue}
                    onChange={setEditValue}
                    onBlur={saveChanges}
                    onKeyDown={handleKeyDown}
                    inputRef={inputRef as React.RefObject<HTMLInputElement>}
                />
            );
        }

        if (column.type === 'date') {
            return (
                <DateEditor
                    value={editValue}
                    onChange={setEditValue}
                    onBlur={saveChanges}
                    onKeyDown={handleKeyDown}
                    inputRef={inputRef as React.RefObject<HTMLInputElement>}
                />
            );
        }

        return (
            <TextEditor
                value={editValue}
                onChange={setEditValue}
                onBlur={saveChanges}
                onKeyDown={handleKeyDown}
                inputRef={inputRef as React.RefObject<HTMLInputElement>}
            />
        );
    };

    return (
        <div
            className={`${styles.cell} ${isEditing ? styles.editing : ''}`}
            style={{ width: column.width, minWidth: column.width, maxWidth: column.width }}
            onDoubleClick={startEditing}
        >
            {isEditing ? renderEditor() : renderValue()}
        </div>
    );
});