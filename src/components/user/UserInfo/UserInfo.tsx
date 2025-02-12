import { HTMLAttributes } from "react";
import Avatar from "../Avatar";
import "./UserInfo.css";

export interface UserInfoProps extends HTMLAttributes<HTMLDivElement> {
    username: string;
    avatarUrl?: string;
    subtitle?: string;
    timestamp?: string;
    size?: "small" | "medium" | "large";
}

const UserInfo = ({
    username,
    avatarUrl,
    subtitle,
    timestamp,
    size = "medium",
    className = "",
    ...props
}: UserInfoProps) => {
    const baseClass = "user-info";
    const classes = [baseClass, `${baseClass}--${size}`, className]
        .filter(Boolean)
        .join(" ");

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        });
    };

    return (
        <div className={classes} {...props}>
            <Avatar
                src={avatarUrl}
                username={username}
                size={size}
                className={`${baseClass}__avatar`}
            />
            <div className={`${baseClass}__content`}>
                <div className={`${baseClass}__primary`}>
                    <span className={`${baseClass}__username`}>
                        @{username}
                    </span>
                    {timestamp && (
                        <span className={`${baseClass}__timestamp`}>
                            {formatTimestamp(timestamp)}
                        </span>
                    )}
                </div>
                {subtitle && (
                    <span className={`${baseClass}__subtitle`}>{subtitle}</span>
                )}
            </div>
        </div>
    );
};

export default UserInfo;
