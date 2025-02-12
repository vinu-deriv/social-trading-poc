import "./Badge.css";

interface BadgeProps {
    variant: "success" | "failed" | "warning" | "info" | "neutral" | "brand";
    icon?: React.ReactNode;
    children: React.ReactNode;
}

const Badge = ({ variant, icon, children }: BadgeProps) => (
    <div className={`badge badge--${variant}`}>
        {icon && <span className="badge__icon">{icon}</span>}
        <span className="badge__text">{children}</span>
    </div>
);

export default Badge;
