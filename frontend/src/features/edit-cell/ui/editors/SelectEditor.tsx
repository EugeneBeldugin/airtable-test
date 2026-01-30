import { Select } from '../../../../shared/ui';

interface SelectEditorProps {
    value: string;
    options: string[];
    onChange: (value: string) => void;
    onBlur: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    inputRef: React.RefObject<HTMLSelectElement>;
}

export function SelectEditor({ value, options, onChange, onBlur, onKeyDown, inputRef }: SelectEditorProps) {
    return (
        <Select
            ref={inputRef}
            value={value}
            options={options}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
        />
    );
}