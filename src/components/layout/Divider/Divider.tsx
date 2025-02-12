import { HTMLAttributes } from "react";
import "./Divider.css";

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
    orientation?: "horizontal" | "vertical";
    variant?: "solid" | "dashed" | "dotted";
    spacing?: "small" | "medium" | "large";
}

const Divider = ({
    orientation = "horizontal",
    variant = "solid",
    spacing = "medium",
    className = "",
    ...props
}: DividerProps) => {
    const baseClass = "divider";
    const classes = [
        baseClass,
        `${baseClass}--${orientation}`,
        `${baseClass}--${variant}`,
        `${baseClass}--spacing-${spacing}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return <hr className={classes} role="separator" {...props} />;
};

export default Divider;
