import { forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ fullWidth = true, className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={`${styles.input} ${fullWidth ? styles.fullWidth : ''} ${className || ''}`}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';