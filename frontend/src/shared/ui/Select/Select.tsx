import { forwardRef } from 'react';
import styles from './Select.module.css';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: string[];
    fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ options, fullWidth = true, className, ...props }, ref) => {
        return (
            <select
                ref={ref}
                className={`${styles.select} ${fullWidth ? styles.fullWidth : ''} ${className || ''}`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        );
    }
);

Select.displayName = 'Select';