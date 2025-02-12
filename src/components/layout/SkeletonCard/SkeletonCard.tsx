import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./SkeletonCard.css";

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card__banner">
        <div className="skeleton-card__avatar">
          <Skeleton circle width={80} height={80} />
        </div>
      </div>
      <div className="skeleton-card__info">
        <Skeleton width={120} style={{ marginBottom: "1rem" }} />
        <div className="skeleton-card__stats">
          <div className="skeleton-card__stat">
            <Skeleton width={60} />
            <Skeleton width={40} />
          </div>
          <div className="skeleton-card__stat">
            <Skeleton width={60} />
            <Skeleton width={40} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
