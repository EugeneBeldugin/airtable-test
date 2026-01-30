import { Input } from '../../../../shared/ui';

interface TextEditorProps {
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    inputRef: React.RefObject<HTMLInputElement>;
}

export function TextEditor({ value, onChange, onBlur, onKeyDown, inputRef }: TextEditorProps) {
    return (
        <Input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
        />
    );
}