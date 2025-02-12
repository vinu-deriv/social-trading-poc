import { HTMLAttributes } from "react";
import "./Container.css";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
    padding?: "none" | "small" | "medium" | "large";
    centered?: boolean;
}

const Container = ({
    maxWidth = "lg",
    padding = "medium",
    centered = true,
    className = "",
    children,
    ...props
}: ContainerProps) => {
    const baseClass = "container";
    const classes = [
        baseClass,
        `${baseClass}--${maxWidth}`,
        padding !== "none" && `${baseClass}--padding-${padding}`,
        centered && `${baseClass}--centered`,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};

export default Container;
