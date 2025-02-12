import { InputHTMLAttributes, forwardRef } from "react";
import "./TextInput.css";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
    helperText?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    ({ error, label, helperText, className = "", ...props }, ref) => {
        const baseClass = "text-input";
        const classes = [baseClass, error && `${baseClass}--error`, className]
            .filter(Boolean)
            .join(" ");

        return (
            <div className={`${baseClass}-wrapper`}>
                {label && (
                    <label className={`${baseClass}__label`}>{label}</label>
                )}
                <input ref={ref} className={classes} {...props} />
                {(error || helperText) && (
                    <span
                        className={`${baseClass}__helper-text ${
                            error ? `${baseClass}__helper-text--error` : ""
                        }`}
                    >
                        {error || helperText}
                    </span>
                )}
            </div>
        );
    }
);

TextInput.displayName = "TextInput";

export default TextInput;
