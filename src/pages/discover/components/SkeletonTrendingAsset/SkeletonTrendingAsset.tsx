import { FC } from 'react';
import './SkeletonTrendingAsset.css';

interface SkeletonTrendingAssetProps {
  isMobile?: boolean;
}

const SkeletonTrendingAsset: FC<SkeletonTrendingAssetProps> = () => {
  return (
    <div className="skeleton-asset-card">
      <div className="skeleton-asset-card__image" />
      <div className="skeleton-asset-card__content">
        <div className="skeleton-asset-card__header">
          <div className="skeleton skeleton-block skeleton-asset-card__title" />
          <div className="skeleton skeleton-block skeleton-asset-card__symbol" />
        </div>
        <div className="skeleton-asset-card__stats">
          <div className="skeleton-asset-card__left">
            <div className="skeleton skeleton-block skeleton-asset-card__price" />
            <div className="skeleton skeleton-block skeleton-asset-card__change" />
          </div>
          <div className="skeleton skeleton-block skeleton-asset-card__button" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonTrendingAsset;
