import { forwardRef } from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                type="checkbox"
                className={`${styles.checkbox} ${className || ''}`}
                {...props}
            />
        );
    }
);

Checkbox.displayName = 'Checkbox';