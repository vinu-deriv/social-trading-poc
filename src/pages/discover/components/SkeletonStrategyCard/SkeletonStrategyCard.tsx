import './SkeletonStrategyCard.css';

interface SkeletonStrategyCardProps {
  rank?: number;
}

const SkeletonStrategyCard = ({ rank }: SkeletonStrategyCardProps) => {
  return (
    <div className="strategy-list__item">
      <div className="strategy-list__header">
        <div className="strategy-list__header-main">
          <div className="strategy-list__title">
            <div className="skeleton skeleton-block skeleton-strategy__title" />
            <div className="skeleton skeleton-block skeleton-strategy__username" />
          </div>
          <div className="skeleton skeleton-block skeleton-strategy__button" />
        </div>
        <div className="skeleton skeleton-block skeleton-strategy__description" />
      </div>
      <div className="strategy-list__stats skeleton-strategy__stats skeleton skeleton-block" />
      <div className="strategy-list__meta">
        <div className="skeleton skeleton-block skeleton-strategy__risk" />
        {rank && <div className="skeleton skeleton-block skeleton-strategy__rank" />}
      </div>
    </div>
  );
};

export default SkeletonStrategyCard;
