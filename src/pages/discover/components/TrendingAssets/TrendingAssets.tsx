import { useMemo, useState } from 'react';
import AIButton from '../../../../components/AIButton';
import ArrowUpTrend from '../../../../assets/icons/ArrowUpTrend';
import ArrowDownTrend from '../../../../assets/icons/ArrowDownTrend';
import YahooLogo from '../../../../assets/icons/yahoo.png';
import { AIInsight } from '../../../../types/ai.types';
import InsightsList from '../InsightsList/InsightsList';
import './TrendingAssets.css';

interface Asset {
  symbol: string;
  name: string;
  imageUrl: string;
  currentPrice: number;
  changePercentage: number;
  direction: 'up' | 'down';
}

interface TrendingAssetsProps {
  assets: Asset[];
  loading: boolean;
}

export default function TrendingAssets({ assets, loading }: TrendingAssetsProps) {
  const LLM_SERVER_URL = import.meta.env.VITE_LLM_SERVER_URL;

  if (!LLM_SERVER_URL) {
    throw new Error('VITE_LLM_SERVER_URL environment variable is not set');
  }
  const [insights, setInsights] = useState<AIInsight[]>([]);

  const handleRemoveInsight = (postId: string) => {
    setInsights(prev => prev.filter(insight => insight.postId !== postId));
  };
  const [loadingSymbol, setLoadingSymbol] = useState<string | null>(null);

  const handleGetInsight = async (symbol: string) => {
    try {
      setLoadingSymbol(symbol);
      const response = await fetch(`${LLM_SERVER_URL}/api/ai/ai-insights-for-symbol/${symbol}`);
      const data = await response.json();
      if (data.insight) {
        setInsights(prev => {
          // Remove any existing insight for this symbol
          const filtered = prev.filter(i => i.postId.split('_')[0] !== symbol);
          // Add new insight
          return [...filtered, data.insight];
        });
      }
    } catch (error) {
      console.error('Error fetching insight:', error);
    } finally {
      setLoadingSymbol(null);
    }
  };
  const sortedAssets = useMemo(() => {
    return [...assets].sort((a, b) => Math.abs(b.changePercentage) - Math.abs(a.changePercentage));
  }, [assets]);

  return (
    <div className="trending-assets-container">
      <h2 className="trending-assets-heading">
        <img src={YahooLogo} alt="Yahoo Finance" className="yahoo-finance-logo" />
        Yahoo Finance Suggested Assets
      </h2>
      <div className="trending-assets-wrapper">
        <div className="trending-assets">
          {loading
            ? [...Array(5)].map((_, index) => (
                <div key={index} className="asset-card skeleton">
                  <div className="asset-card__image skeleton-image">
                    <img src={YahooLogo} alt="Yahoo Finance" className="skeleton-yahoo-logo" />
                  </div>
                  <div className="asset-card__content">
                    <div className="asset-card__title skeleton-text" />
                    <div className="asset-card__price skeleton-text" />
                  </div>
                </div>
              ))
            : sortedAssets.map(asset => (
                <div key={asset.symbol} className="asset-card">
                  <img src={asset.imageUrl} alt={asset.name} className="asset-card__image" />
                  <div className="asset-card__content">
                    <div className="asset-card__header">
                      <h3 className="asset-card__title">{asset.name}</h3>
                      <span className="asset-card__symbol">{asset.symbol}</span>
                    </div>
                    <div className="asset-card__stats">
                      <span className="asset-card__price">${asset.currentPrice.toFixed(2)}</span>
                      <div className="asset-card__right">
                        <div className="asset-card__ai-button">
                          <AIButton
                            onClick={() => {
                              handleGetInsight(asset.symbol);
                            }}
                            isLoading={loadingSymbol === asset.symbol}
                            loadingText="Analyzing..."
                          >
                            Ask AI
                          </AIButton>
                        </div>
                        <span
                          className={`asset-card__change ${
                            asset.direction === 'up' ? 'up' : 'down'
                          }`}
                        >
                          {asset.direction === 'up' ? <ArrowUpTrend /> : <ArrowDownTrend />}
                          {Math.abs(asset.changePercentage).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
        <InsightsList
          insights={insights}
          loadingSymbol={loadingSymbol}
          onRemoveInsight={handleRemoveInsight}
        />
      </div>
    </div>
  );
}
