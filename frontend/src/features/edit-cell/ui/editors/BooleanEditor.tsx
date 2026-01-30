import { Checkbox } from '../../../../shared/ui';

interface BooleanEditorProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    inputRef: React.RefObject<HTMLInputElement>;
}

export function BooleanEditor({ checked, onChange, inputRef }: BooleanEditorProps) {
    return (
        <Checkbox
            ref={inputRef}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
        />
    );
}