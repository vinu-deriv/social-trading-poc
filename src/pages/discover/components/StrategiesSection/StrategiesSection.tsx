import { useMemo } from 'react';
import './StrategiesSection.css';
import '../shared.css';
import { useNavigate } from 'react-router-dom';
import StrategyListItem from '@/components/strategy/StrategyListItem';
import SkeletonCard from '../SkeletonCard';
import type { ExtendedStrategy } from '@/types/strategy.types';

interface StrategiesSectionProps {
  loading: boolean;
  strategies: ExtendedStrategy[];
  onCopy: (strategyId: string) => Promise<void>;
}

export default function StrategiesSection({ loading, strategies, onCopy }: StrategiesSectionProps) {
  const navigate = useNavigate();
  // Strategy sections
  const topStrategies = useMemo(() => {
    return strategies.slice(0, 3);
  }, [strategies]);

  const aiSuggestedStrategies = useMemo(() => {
    return strategies.slice(3, 8);
  }, [strategies]);

  const popularStrategies = useMemo(() => {
    return strategies.slice(8, 13);
  }, [strategies]);

  if (loading) {
    return (
      <>
        <h2 className="section-title">Top Strategies</h2>
        <div className="top-strategies">
          {[...Array(3)].map((_, index) => (
            <SkeletonCard key={index} large showRank />
          ))}
        </div>

        <h2 className="section-title">AI Suggested Strategies</h2>
        <div className="strategies-grid">
          {[...Array(5)].map((_, index) => (
            <SkeletonCard key={`ai-${index}`} />
          ))}
        </div>

        <h2 className="section-title">Popular Strategies</h2>
        <div className="strategies-grid">
          {[...Array(5)].map((_, index) => (
            <SkeletonCard key={`popular-${index}`} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="section-title">Top Strategies</h2>
      <div className="top-strategies">
        {topStrategies.map((strategy, index) => (
          <StrategyListItem
            key={strategy.id}
            strategy={strategy}
            rank={index + 1}
            showCopyButton={true}
            isCopying={strategy.isCopying}
            onCopy={(strategyId: string) => onCopy(strategyId)}
            onClick={(strategyId: string) => navigate(`/strategies/${strategyId}`)}
          />
        ))}
      </div>

      <h2 className="section-title">AI Suggested Strategies</h2>
      <div className="strategies-grid">
        {aiSuggestedStrategies.map(strategy => (
          <StrategyListItem
            key={strategy.id}
            strategy={strategy}
            showCopyButton={true}
            isCopying={strategy.isCopying}
            onCopy={(strategyId: string) => onCopy(strategyId)}
            onClick={(strategyId: string) => navigate(`/strategies/${strategyId}`)}
          />
        ))}
      </div>

      <h2 className="section-title">Popular Strategies</h2>
      <div className="strategies-grid">
        {popularStrategies.map(strategy => (
          <StrategyListItem
            key={strategy.id}
            strategy={strategy}
            showCopyButton={true}
            isCopying={strategy.isCopying}
            onCopy={(strategyId: string) => onCopy(strategyId)}
            onClick={(strategyId: string) => navigate(`/strategies/${strategyId}`)}
          />
        ))}
      </div>
    </>
  );
}
