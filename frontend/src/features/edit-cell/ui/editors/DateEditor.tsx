import { Input } from '../../../../shared/ui';

interface DateEditorProps {
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    inputRef: React.RefObject<HTMLInputElement>;
}

export function DateEditor({ value, onChange, onBlur, onKeyDown, inputRef }: DateEditorProps) {
    const dateValue = value ? value.split('T')[0] : '';

    return (
        <Input
            ref={inputRef}
            type="date"
            value={dateValue}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
        />
    );
}