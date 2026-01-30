import { useState, useCallback, useRef, useEffect } from 'react';
import { useUpdateRow } from '../../../entities/row';
import type { Row } from '../../../entities/row';
import type { ColumnConfig } from '../../../shared/types';

interface UseEditCellParams {
    row: Row;
    column: ColumnConfig;
    onEditStart?: () => void;
    onEditEnd?: () => void;
}

export function useEditCell({ row, column, onEditStart, onEditEnd }: UseEditCellParams) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');
    const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);
    const updateRow = useUpdateRow();

    const value = row[column.key as keyof Row];

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            if (inputRef.current instanceof HTMLInputElement && inputRef.current.type !== 'checkbox') {
                inputRef.current.select();
            }
        }
    }, [isEditing]);

    const startEditing = useCallback(() => {
        if (column.key === 'id' || column.editable === false) return;

        setEditValue(value?.toString() ?? '');
        setIsEditing(true);
        onEditStart?.();
    }, [column.key, column.editable, value, onEditStart]);

    const cancelEditing = useCallback(() => {
        setIsEditing(false);
        onEditEnd?.();
    }, [onEditEnd]);

    const saveChanges = useCallback(() => {
        setIsEditing(false);
        onEditEnd?.();

        let newValue: string | number | boolean | null = editValue;

        if (column.type === 'number') {
            newValue = editValue === '' ? null : parseFloat(editValue);
        } else if (column.type === 'boolean') {
            newValue = editValue === 'true';
        }

        if (newValue === value || (newValue === null && value === null)) {
            return;
        }

        updateRow.mutate({
            id: row.id,
            column: column.key as keyof Row,
            value: newValue,
        });
    }, [column.key, column.type, editValue, row.id, value, updateRow, onEditEnd]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                saveChanges();
            } else if (e.key === 'Escape') {
                cancelEditing();
            }
        },
        [saveChanges, cancelEditing]
    );

    const handleBooleanChange = useCallback(
        (checked: boolean) => {
            updateRow.mutate({
                id: row.id,
                column: column.key as keyof Row,
                value: checked,
            });
            setIsEditing(false);
            onEditEnd?.();
        },
        [row.id, column.key, updateRow, onEditEnd]
    );

    return {
        isEditing,
        editValue,
        inputRef,
        value,
        startEditing,
        cancelEditing,
        saveChanges,
        setEditValue,
        handleKeyDown,
        handleBooleanChange,
    };
}