import { Input } from '../../../../shared/ui';

interface NumberEditorProps {
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    inputRef: React.RefObject<HTMLInputElement>;
}

export function NumberEditor({ value, onChange, onBlur, onKeyDown, inputRef }: NumberEditorProps) {
    return (
        <Input
            ref={inputRef}
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
        />
    );
}