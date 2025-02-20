import './SkeletonUserCard.css';

interface SkeletonUserCardProps {
  rank?: number;
}

const SkeletonUserCard = ({ rank }: SkeletonUserCardProps) => {
  return (
    <div className="user-card">
      <div className="user-card__header">
        {rank && (
          <div className="user-card__rank">
            <div className="skeleton skeleton-block skeleton-rank" />
          </div>
        )}
        <div className="user-card__avatar-container">
          <div className="user-card__avatar-wrapper">
            <div className="skeleton skeleton-avatar" />
          </div>
        </div>
        <div className="user-card__details">
          <div className="skeleton skeleton-block skeleton-name" />
          <div className="skeleton skeleton-block skeleton-username" />
          <div className="skeleton skeleton-block skeleton-badge" />
        </div>
      </div>

      <div className="user-card__cta">
        <div className="user-card__stats">
          <div className="user-card__stat">
            <div className="skeleton skeleton-block skeleton-stat-label" />
            {/* <div className="skeleton skeleton-block skeleton-stat-value" /> */}
          </div>
        </div>
        <div className="skeleton skeleton-block skeleton-button" />
      </div>
    </div>
  );
};

export default SkeletonUserCard;
