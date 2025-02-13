import { useMemo } from "react";
import ArrowUpTrend from "../../../../assets/icons/ArrowUpTrend";
import ArrowDownTrend from "../../../../assets/icons/ArrowDownTrend";
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
                  <ArrowUpTrend />
                ) : (
                  <ArrowDownTrend />
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
