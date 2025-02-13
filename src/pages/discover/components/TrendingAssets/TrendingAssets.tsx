import { useMemo } from "react";
import "./TrendingAssets.css";

interface Asset {
  symbol: string;
  name: string;
  imageUrl: string;
  currentPrice: number;
  changePercentage: number;
  direction: "up" | "down";
}

interface TrendingAssetsProps {
  assets: Asset[];
  loading: boolean;
}

export default function TrendingAssets({
  assets,
  loading,
}: TrendingAssetsProps) {
  const sortedAssets = useMemo(() => {
    return [...assets].sort(
      (a, b) => Math.abs(b.changePercentage) - Math.abs(a.changePercentage)
    );
  }, [assets]);

  if (loading) {
    return (
      <div className="trending-assets">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="asset-card skeleton">
            <div className="asset-card__image skeleton-image" />
            <div className="asset-card__content">
              <div className="asset-card__title skeleton-text" />
              <div className="asset-card__price skeleton-text" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="trending-assets">
      {sortedAssets.map((asset) => (
        <div key={asset.symbol} className="asset-card">
          <img
            src={asset.imageUrl}
            alt={asset.name}
            className="asset-card__image"
          />
          <div className="asset-card__content">
            <div className="asset-card__header">
              <h3 className="asset-card__title">{asset.name}</h3>
              <span className="asset-card__symbol">{asset.symbol}</span>
            </div>
            <div className="asset-card__stats">
              <span className="asset-card__price">
                ${asset.currentPrice.toLocaleString()}
              </span>
              <span
                className={`asset-card__change ${
                  asset.direction === "up" ? "up" : "down"
                }`}
              >
                {asset.direction === "up" ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 3.33334L8.94281 2.39053L8 1.44772L7.05719 2.39053L8 3.33334ZM7.33333 13.3333C7.33333 13.7015 7.63181 14 8 14C8.36819 14 8.66667 13.7015 8.66667 13.3333L7.33333 13.3333ZM12.9428 6.39053L8.94281 2.39053L7.05719 4.27615L11.0572 8.27615L12.9428 6.39053ZM7.05719 2.39053L3.05719 6.39053L4.94281 8.27615L8.94281 4.27615L7.05719 2.39053ZM7.33333 3.33334L7.33333 13.3333L8.66667 13.3333L8.66667 3.33334L7.33333 3.33334Z"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 12.6667L7.05719 13.6095L8 14.5523L8.94281 13.6095L8 12.6667ZM8.66667 2.66667C8.66667 2.29848 8.36819 2 8 2C7.63181 2 7.33333 2.29848 7.33333 2.66667L8.66667 2.66667ZM3.05719 9.60947L7.05719 13.6095L8.94281 11.7239L4.94281 7.72386L3.05719 9.60947ZM8.94281 13.6095L12.9428 9.60947L11.0572 7.72386L7.05719 11.7239L8.94281 13.6095ZM8.66667 12.6667L8.66667 2.66667L7.33333 2.66667L7.33333 12.6667L8.66667 12.6667Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                {Math.abs(asset.changePercentage)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
