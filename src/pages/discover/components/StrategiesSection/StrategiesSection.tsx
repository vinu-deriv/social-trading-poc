import { useMemo, useState } from 'react';
import StrategyCard from '@/pages/discover/components/StrategyCard';
import SkeletonCard from '@/pages/discover/components/SkeletonCard';
import { strategyService } from '@/services/strategy';
import AIButton from '@/components/AIButton';
import StrategyComparison from '@/pages/discover/components/StrategyComparison';
import './StrategiesSection.css';

import type { Strategy, StrategyComparison as ComparisonType } from '@/types/strategy.types';

interface StrategiesSectionProps {
  loading: boolean;
  strategies: Strategy[];
  onFollow: (leaderId: string) => Promise<void>;
  onCopy: (strategyId: string) => Promise<void>;
}

interface ComparisonResult {
  loading: boolean;
  error?: string;
  result?: ComparisonType;
}

export default function StrategiesSection({
  loading,
  strategies,
  onFollow,
  onCopy,
}: StrategiesSectionProps) {
  const [selectedStrategies, setSelectedStrategies] = useState<Set<string>>(new Set());
  const [comparison, setComparison] = useState<ComparisonResult>({ loading: false });
  const [showComparison, setShowComparison] = useState(false);

  const handleStrategySelect = (strategyId: string) => {
    setSelectedStrategies(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(strategyId)) {
        newSelection.delete(strategyId);
      } else if (newSelection.size < 4) {
        newSelection.add(strategyId);
      }
      return newSelection;
    });
  };

  const handleCompare = async () => {
    if (selectedStrategies.size < 2) return;

    setComparison({ loading: true });
    try {
      const strategiesToCompare = strategies.filter(s => selectedStrategies.has(s.id));
      const result = await strategyService.compareStrategies(strategiesToCompare);
      setComparison({ loading: false, result });
      setShowComparison(true);
      setSelectedStrategies(new Set()); // Clear selections
    } catch (error) {
      setComparison({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to compare strategies',
      });
    }
  };

  const handleCloseComparison = () => {
    setShowComparison(false);
    setSelectedStrategies(new Set()); // Clear selections when closing
  };

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
        <h2 className="discover__section-title">Top Strategies</h2>
        <div className="discover__top-leaders">
          {[...Array(3)].map((_, index) => (
            <SkeletonCard key={index} large showRank />
          ))}
        </div>

        <h2 className="discover__section-title">AI Suggested Strategies</h2>
        <div className="discover__leaders-grid">
          {[...Array(5)].map((_, index) => (
            <SkeletonCard key={`ai-${index}`} />
          ))}
        </div>

        <h2 className="discover__section-title">Popular Strategies</h2>
        <div className="discover__leaders-grid">
          {[...Array(5)].map((_, index) => (
            <SkeletonCard key={`popular-${index}`} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {selectedStrategies.size > 0 && (
        <div className="discover__compare-section">
          <AIButton
            onClick={handleCompare}
            disabled={selectedStrategies.size < 2}
            isLoading={comparison.loading}
            loadingText="Comparing..."
          >
            {selectedStrategies.size < 2
              ? `Select ${2 - selectedStrategies.size} more to compare`
              : `Compare (${selectedStrategies.size}/4)`}
          </AIButton>
        </div>
      )}

      {comparison.error && <div className="discover__error">{comparison.error}</div>}

      {comparison.result && (
        <StrategyComparison
          comparison={comparison.result}
          isOpen={showComparison}
          onClose={handleCloseComparison}
        />
      )}

      <h2 className="discover__section-title">Top Strategies</h2>
      <div className="discover__top-leaders">
        {topStrategies.map((strategy, index) => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            rank={index + 1}
            onFollow={onFollow}
            onCopy={onCopy}
            large
            selected={selectedStrategies.has(strategy.id)}
            onSelect={() => handleStrategySelect(strategy.id)}
          />
        ))}
      </div>

      <h2 className="discover__section-title">AI Suggested Strategies</h2>
      <div className="discover__leaders-grid">
        {aiSuggestedStrategies.map(strategy => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            onFollow={onFollow}
            onCopy={onCopy}
            selected={selectedStrategies.has(strategy.id)}
            onSelect={() => handleStrategySelect(strategy.id)}
          />
        ))}
      </div>

      <h2 className="discover__section-title">Popular Strategies</h2>
      <div className="discover__leaders-grid">
        {popularStrategies.map(strategy => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            onFollow={onFollow}
            onCopy={onCopy}
            selected={selectedStrategies.has(strategy.id)}
            onSelect={() => handleStrategySelect(strategy.id)}
          />
        ))}
      </div>
    </>
  );
}
