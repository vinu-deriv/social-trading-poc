import { ImgHTMLAttributes } from "react";
import "./Avatar.css";

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
    size?: "small" | "medium" | "large";
    username?: string;
}

const Avatar = ({
    size = "medium",
    username,
    src,
    alt,
    className = "",
    ...props
}: AvatarProps) => {
    const baseClass = "avatar";
    const classes = [baseClass, `${baseClass}--${size}`, className]
        .filter(Boolean)
        .join(" ");

    if (!src) {
        // Show initials if no image
        const initials = username ? username.slice(0, 2).toUpperCase() : "U";

        return (
            <div
                className={`${classes} ${baseClass}--placeholder`}
                title={username}
                {...props}
            >
                {initials}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt || username || "User avatar"}
            className={classes}
            {...props}
        />
    );
};

export default Avatar;
