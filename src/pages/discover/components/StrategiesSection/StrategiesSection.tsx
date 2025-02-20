import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { strategyService } from '@/services/strategy';
import './StrategiesSection.css';
import '../shared.css';
import SkeletonCard from '../SkeletonCard';
import AIButton from '@/components/AIButton/AIButton';
import Chip from '@/components/Chip';
import type { ExtendedStrategy } from '@/types/strategy.types';
import TopStrategiesSection from '../TopStrategiesSection';
import AIStrategiesSection from '../AIStrategiesSection';
import PopularStrategiesSection from '../PopularStrategiesSection';

interface StrategiesSectionProps {
  loading: boolean;
  strategies: ExtendedStrategy[];
  onCopy: (strategyId: string) => Promise<void>;
}

export default function StrategiesSection({ loading, strategies, onCopy }: StrategiesSectionProps) {
  const navigate = useNavigate();
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [activeTab, setActiveTab] = useState<'top' | 'ai' | 'popular'>('top');

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
        navigate('/strategies/compare', { state: { comparison } });
        setSelectedStrategies([]);
      } catch (error) {
        console.error('Error comparing strategies:', error);
      } finally {
        setIsComparing(false);
      }
    }
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

        <div className="strategies-section__tabs">
          <Chip active={activeTab === 'top'} onClick={() => setActiveTab('top')}>
            Top Strategies
          </Chip>
          <Chip active={activeTab === 'ai'} onClick={() => setActiveTab('ai')}>
            ✧ AI Suggested
          </Chip>
          <Chip active={activeTab === 'popular'} onClick={() => setActiveTab('popular')}>
            Popular
          </Chip>
        </div>

        <h2 className="section-title">
          {activeTab === 'top'
            ? 'Top Strategies'
            : activeTab === 'ai'
              ? 'AI Suggested Strategies'
              : 'Popular Strategies'}
        </h2>
        <div className={activeTab === 'top' ? 'top-strategies' : 'strategies-grid'}>
          {[...Array(activeTab === 'top' ? 3 : 5)].map((_, index) => (
            <SkeletonCard key={index} large={activeTab === 'top'} showRank={activeTab === 'top'} />
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

      <div className="strategies-section__tabs">
        <Chip active={activeTab === 'top'} onClick={() => setActiveTab('top')}>
          Top Strategies
        </Chip>
        <Chip active={activeTab === 'ai'} onClick={() => setActiveTab('ai')}>
          ✧ AI Suggested
        </Chip>
        <Chip active={activeTab === 'popular'} onClick={() => setActiveTab('popular')}>
          Popular
        </Chip>
      </div>

      {activeTab === 'top' && (
        <TopStrategiesSection
          strategies={topStrategies}
          onCopy={onCopy}
          onSelect={handleStrategySelect}
          onStrategyClick={handleStrategyClick}
          selectedStrategies={selectedStrategies}
        />
      )}
      {activeTab === 'ai' && (
        <AIStrategiesSection
          strategies={aiSuggestedStrategies}
          onCopy={onCopy}
          onSelect={handleStrategySelect}
          onStrategyClick={handleStrategyClick}
          selectedStrategies={selectedStrategies}
        />
      )}
      {activeTab === 'popular' && (
        <PopularStrategiesSection
          strategies={popularStrategies}
          onCopy={onCopy}
          onSelect={handleStrategySelect}
          onStrategyClick={handleStrategyClick}
          selectedStrategies={selectedStrategies}
        />
      )}
    </div>
  );
}
