import { FC, useState, useEffect } from 'react';
import type { Strategy } from '@/types/strategy.types';
import { useLongPress } from '@/hooks/useLongPress';
import Trophy from '@/assets/icons/Trophy';
import Tick from '@/assets/icons/Tick';
import './StrategyListItem.css';

interface ExtendedStrategy extends Strategy {
  leader?: {
    username: string;
    displayName: string;
    profilePicture?: string;
  };
}

interface StrategyListItemProps {
  strategy: ExtendedStrategy;
  showCopyButton?: boolean;
  isCopying?: boolean;
  onCopy?: (strategyId: string) => Promise<boolean>;
  onClick?: (strategyId: string) => void;
  rank?: number;
  selected?: boolean;
  onSelect?: () => void;
}

const StrategyListItem: FC<StrategyListItemProps> = ({
  strategy,
  showCopyButton = true,
  isCopying = false,
  onCopy,
  onClick,
  rank,
  selected = false,
  onSelect,
}) => {
  const [loading, setLoading] = useState(false);
  const [isCurrentlyCopying, setIsCurrentlyCopying] = useState(isCopying);

  // Update local state when prop changes
  useEffect(() => {
    setIsCurrentlyCopying(isCopying);
  }, [isCopying]);

  const getRiskLevelClass = (riskLevel: string) => {
    const level = riskLevel.toLowerCase();
    return `strategy-list__risk strategy-list__risk--${level}`;
  };

  const handleClick = () => {
    if (selected) {
      onSelect?.();
    } else {
      onClick?.(strategy.id);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    // Stop propagation if clicking on buttons
    if (
      (e.target as HTMLElement).tagName === 'BUTTON' ||
      (e.target as HTMLElement).closest('button')
    ) {
      e.stopPropagation();
    }
  };

  const longPressHandlers = useLongPress({
    onClick: handleClick,
    onLongPress: () => onSelect?.(),
  });

  return (
    <div
      className={`strategy-list__item ${rank ? 'strategy-list__item--ranked' : ''} ${
        selected ? 'strategy-list__item--selected' : ''
      }`}
      {...longPressHandlers}
      onClick={handleButtonClick}
      style={{ cursor: 'pointer' }}
    >
      {selected && (
        <div className="strategy-list__tick">
          <Tick />
        </div>
      )}
      <div className="strategy-list__header">
        <div className="strategy-list__header-main">
          <div className="strategy-list__title">
            <h4>{strategy.name}</h4>
            {strategy.leader && (
              <span className="strategy-list__username">by @{strategy.leader.username}</span>
            )}
          </div>
          {!selected && showCopyButton && onCopy && (
            <button
              className={`strategy-list__copy-btn ${
                isCurrentlyCopying
                  ? 'strategy-list__copy-btn--secondary'
                  : 'strategy-list__copy-btn--primary'
              }`}
              onClick={async e => {
                e.stopPropagation(); // Prevent navigation when clicking the button
                if (!onCopy) return;

                setLoading(true);
                try {
                  const newCopyingState = await onCopy(strategy.id);
                  setIsCurrentlyCopying(newCopyingState);
                } catch (error) {
                  console.error('Error copying strategy:', error);
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              {loading ? 'Processing...' : isCurrentlyCopying ? 'Stop Copying' : 'COPY'}
            </button>
          )}
        </div>
        <p className="strategy-list__description">{strategy.description}</p>
      </div>

      <div className="strategy-list__stats">
        <div className="strategy-list__stat-item">
          <span
            className="strategy-list__stat-value"
            style={{
              color: strategy.performance.totalReturn > 0 ? '#059669' : '#dc2626',
            }}
          >
            {strategy.performance.totalReturn > 0 ? '+' : ''}
            {strategy.performance.totalReturn}%
          </span>
          <span className="strategy-list__stat-label">Total Return</span>
        </div>
        <div className="strategy-list__stat-item">
          <span className="strategy-list__stat-value">{strategy.performance.winRate}%</span>
          <span className="strategy-list__stat-label">Win Rate</span>
        </div>
        <div className="strategy-list__stat-item">
          <span className="strategy-list__stat-value">{strategy.performance.averageProfit}%</span>
          <span className="strategy-list__stat-label">Avg. Profit</span>
        </div>
        <div className="strategy-list__stat-item">
          <span className="strategy-list__stat-value">{strategy.copiers.length}</span>
          <span className="strategy-list__stat-label">Copiers</span>
        </div>
      </div>

      <div className="strategy-list__meta">
        <span className={getRiskLevelClass(strategy.riskLevel)}>{strategy.riskLevel} Risk</span>
        {rank && (
          <div className="strategy-list__rank">
            <Trophy className="strategy-list__trophy" />#{rank}
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyListItem;
