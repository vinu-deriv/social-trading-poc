import { ReactNode, ButtonHTMLAttributes } from "react";
import "./Button.css";

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "text"
    | "icon"
    | "action";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    icon?: ReactNode;
    count?: number;
    isActive?: boolean;
    isLoading?: boolean;
    rounded?: boolean;
    children?: ReactNode;
}

const Button = ({
    variant = "primary",
    icon,
    count,
    isActive = false,
    isLoading = false,
    rounded = false,
    children,
    className = "",
    disabled,
    ...props
}: ButtonProps) => {
    const baseClass = "button";
    const classes = [
        baseClass,
        `${baseClass}--${variant}`,
        isActive && `${baseClass}--active`,
        isLoading && `${baseClass}--loading`,
        rounded && `${baseClass}--rounded`,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button className={classes} disabled={disabled || isLoading} {...props}>
            {isLoading && (
                <span className={`${baseClass}__loading-indicator`} />
            )}
            {icon && <span className={`${baseClass}__icon`}>{icon}</span>}
            {children && (
                <span className={`${baseClass}__text`}>{children}</span>
            )}
            {count !== undefined && (
                <span className={`${baseClass}__count`}>{count}</span>
            )}
        </button>
    );
};

export default Button;
