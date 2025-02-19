import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Tick from '../../../../assets/icons/Tick';
import Trophy from '../../../../assets/icons/Trophy';
import './StrategyCard.css';
import PlusIcon from '@/assets/icons/PlusIcon';
import { toggleUserFollow } from '@/services/userService';
import { useLongPress } from '@/hooks/useLongPress';

import type { ExtendedStrategy } from '../../../../types/strategy.types';

interface StrategyCardProps {
  strategy: ExtendedStrategy;
  rank?: number;
  onCopy: (id: string) => void;
  large?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

const StrategyCard: FC<StrategyCardProps> = ({
  strategy,
  rank,
  onCopy,
  large,
  selected,
  onSelect,
}) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(strategy.isFollowing ?? false);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (!currentUser?.id || !strategy.leaderId) return;

    try {
      setLoading(true);
      const newFollowingStatus = await toggleUserFollow(strategy.leaderId, currentUser.id);
      setIsFollowing(newFollowingStatus);
    } catch (error) {
      console.error('Error following leader:', error);
      // Could add toast notification here
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/strategies/${strategy.id}`);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons
    if (
      (e.target as HTMLElement).tagName === 'BUTTON' ||
      (e.target as HTMLElement).closest('button')
    ) {
      e.stopPropagation();
    }
  };

  const formatCopiers = (count: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(count);
  };

  return (
    <div
      className={`strategy-card ${large ? 'strategy-card--large' : ''} ${selected ? 'strategy-card--selected' : ''}`}
      {...useLongPress({
        onClick: onSelect ? undefined : handleCardClick,
        onLongPress: () => onSelect?.(),
      })}
      onClick={handleButtonClick}
      style={{ cursor: 'pointer' }}
    >
      {rank && (
        <div className="strategy-card__rank">
          {rank <= 3 && <Trophy className="strategy-card__trophy" />}#{rank}
        </div>
      )}
      <div className="strategy-card__banner">
        <div className="strategy-card__avatar">
          <div className="strategy-card__avatar-wrapper">
            {strategy.leader?.profilePicture ? (
              <img
                src={strategy.leader.profilePicture}
                alt={strategy.leader.displayName}
                className="strategy-card__avatar-img"
              />
            ) : (
              <div className="strategy-card__avatar-placeholder">
                {strategy.leader?.displayName.slice(0, 2).toUpperCase() || 'ST'}
              </div>
            )}
            <button
              className="strategy-card__follow-icon"
              onClick={handleFollow}
              disabled={loading}
            >
              {isFollowing ? <Tick /> : <PlusIcon />}
            </button>
          </div>
        </div>
      </div>
      <div className="strategy-card__info">
        <h3 className="strategy-card__name">{strategy.name}</h3>
        <p className="strategy-card__leader-name">{strategy.leader?.displayName}</p>
        <span className="strategy-card__trade-type">
          {strategy.tradeType
            ? strategy.tradeType
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
            : strategy.timeframe}
        </span>
        {!selected && (
          <button
            className={`strategy-card__copy-button ${
              strategy.isCopying ? 'strategy-card__copy-button--copied' : ''
            }`}
            onClick={e => {
              e.stopPropagation();
              onCopy(strategy.id);
            }}
          >
            {strategy.isCopying ? 'Stop Copying' : 'Copy Strategy'}
          </button>
        )}
        <div className="strategy-card__stats">
          <div className="strategy-card__stat">
            <span className="strategy-card__stat-label">Currency</span>
            <span className="strategy-card__stat-value">{strategy.currency}</span>
          </div>
          <div className="strategy-card__stat">
            <span className="strategy-card__stat-label">Copiers</span>
            <span className="strategy-card__stat-value">
              {formatCopiers(strategy.copiers.length)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyCard;
