import { useMemo, useState } from 'react';
import { strategyService } from '@/services/strategy';
import './StrategiesSection.css';
import '../shared.css';
import { useNavigate } from 'react-router-dom';
import StrategyListItem from '@/components/strategy/StrategyListItem';
import SkeletonCard from '../SkeletonCard';
import AIButton from '@/components/AIButton/AIButton';
import StrategyComparison from '../StrategyComparison/StrategyComparison';
import type {
  ExtendedStrategy,
  StrategyComparison as ComparisonType,
} from '@/types/strategy.types';

interface StrategiesSectionProps {
  loading: boolean;
  strategies: ExtendedStrategy[];
  onCopy: (strategyId: string) => Promise<void>;
}

export default function StrategiesSection({ loading, strategies, onCopy }: StrategiesSectionProps) {
  const navigate = useNavigate();
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonData, setComparisonData] = useState<ComparisonType | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const handleStrategyClick = (strategyId: string) => {
    if (selectedStrategies.length > 0) {
      handleStrategySelect(strategyId);
    } else {
      navigate(`/strategies/${strategyId}`);
    }
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

  const handleStrategySelect = (strategyId: string) => {
    setSelectedStrategies(prev => {
      if (prev.includes(strategyId)) {
        return prev.filter(id => id !== strategyId);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, strategyId];
    });
  };

  const handleCompare = async () => {
    if (selectedStrategies.length > 1) {
      try {
        setIsComparing(true);
        const selectedStrategyObjects = strategies.filter(s => selectedStrategies.includes(s.id));
        const comparison = await strategyService.compareStrategies(selectedStrategyObjects);
        setComparisonData(comparison);
        setShowComparison(true);
      } catch (error) {
        console.error('Error comparing strategies:', error);
      } finally {
        setIsComparing(false);
      }
    }
  };

  const handleCloseComparison = () => {
    setShowComparison(false);
    setSelectedStrategies([]);
  };

  if (loading) {
    return (
      <div className="strategies-section">
        {selectedStrategies.length > 0 && (
          <div className="strategies-compare-bar">
            <AIButton
              onClick={handleCompare}
              disabled={selectedStrategies.length < 2}
              isLoading={isComparing}
              loadingText="Comparing..."
            >
              Compare ({selectedStrategies.length}/4)
            </AIButton>
          </div>
        )}
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
      </div>
    );
  }

  return (
    <div className="strategies-section">
      {selectedStrategies.length > 0 && (
        <div className="strategies-compare-bar">
          <AIButton
            onClick={handleCompare}
            disabled={selectedStrategies.length < 2}
            isLoading={isComparing}
            loadingText="Comparing..."
          >
            Compare ({selectedStrategies.length}/4)
          </AIButton>
        </div>
      )}

      {comparisonData && (
        <StrategyComparison
          comparison={comparisonData}
          isOpen={showComparison}
          onClose={handleCloseComparison}
        />
      )}

      <h2 className="section-title">Top Strategies</h2>
      <div className="top-strategies">
        {topStrategies.map((strategy, index) => (
          <StrategyListItem
            key={strategy.id}
            strategy={strategy}
            rank={index + 1}
            onCopy={(strategyId: string) => onCopy(strategyId)}
            onClick={handleStrategyClick}
            selected={selectedStrategies.includes(strategy.id)}
            onSelect={() => handleStrategySelect(strategy.id)}
          />
        ))}
      </div>

      <h2 className="section-title">AI Suggested Strategies</h2>
      <div className="strategies-grid">
        {aiSuggestedStrategies.map(strategy => (
          <StrategyListItem
            key={strategy.id}
            strategy={strategy}
            onCopy={(strategyId: string) => onCopy(strategyId)}
            onClick={handleStrategyClick}
            selected={selectedStrategies.includes(strategy.id)}
            onSelect={() => handleStrategySelect(strategy.id)}
          />
        ))}
      </div>

      <h2 className="section-title">Popular Strategies</h2>
      <div className="strategies-grid">
        {popularStrategies.map(strategy => (
          <StrategyListItem
            key={strategy.id}
            strategy={strategy}
            onCopy={(strategyId: string) => onCopy(strategyId)}
            onClick={handleStrategyClick}
            selected={selectedStrategies.includes(strategy.id)}
            onSelect={() => handleStrategySelect(strategy.id)}
          />
        ))}
      </div>
    </div>
  );
}
