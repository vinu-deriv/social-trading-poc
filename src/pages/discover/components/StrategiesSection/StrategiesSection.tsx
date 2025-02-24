import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { discoverService } from '@/modules/discover/services/discoverService';
import { CompareBar } from '../CompareBar/CompareBar';
import { strategySuggestionsService } from '@/services/strategySuggestionsService';
import { strategyService } from '@/services/strategy';
import '../shared.css';
import './StrategiesSection.css';
import Chip from '@/components/Chip';
import type {
  ExtendedStrategy,
  StrategyComparison as ComparisonType,
} from '@/types/strategy.types';
import TopStrategiesSection from '../TopStrategiesSection';
import StrategyComparison from '../StrategyComparison/StrategyComparison';
import SuggestedStrategiesSection from '../SuggestedStrategiesSection';
import PopularStrategiesSection from '../PopularStrategiesSection';
import SkeletonStrategyCard from '../SkeletonStrategyCard';
import { CopyRelationship } from '@/types/copy.types';

export default function StrategiesSection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [topStrategies, setTopStrategies] = useState<ExtendedStrategy[]>([]);
  const [aiSuggestedStrategies, setAiSuggestedStrategies] = useState<ExtendedStrategy[]>([]);
  const [popularStrategies, setPopularStrategies] = useState<ExtendedStrategy[]>([]);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonType | null>(null);
  type StrategyTab = 'top' | 'ai' | 'popular';
  const [activeTab, setActiveTab] = useState<StrategyTab>('top');
  const [copyRelations, setCopyRelations] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch copy relationships
        if (user) {
          const response = await fetch(
            `${import.meta.env.VITE_JSON_SERVER_URL}/copyRelationships?copierId=${user.id}`
          );
          if (response.ok) {
            const relations: CopyRelationship[] = await response.json();
            const relationMap = relations.reduce((acc: Record<string, boolean>, rel) => {
              acc[rel.strategyId] = rel.status === 'active';
              return acc;
            }, {});

            setCopyRelations(relationMap);
          }
        }

        // Fetch strategies based on active tab
        if (activeTab === 'top') {
          const topStrategies = await discoverService.getTopStrategies();
          setTopStrategies(topStrategies);
        } else if (activeTab === 'ai') {
          const suggestions = await strategySuggestionsService.getSuggestedStrategies(user?.id);
          setAiSuggestedStrategies(suggestions);
        } else if (activeTab === 'popular') {
          const strategies = await discoverService.fetchStrategies(user?.id);
          setPopularStrategies(strategies.slice(5, 10));
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, user]);

  const handleCopyStrategy = useCallback(
    async (strategyId: string): Promise<boolean> => {
      if (!user) return false;
      try {
        const isCopying = copyRelations[strategyId];
        const success = await discoverService.toggleCopyStrategy(user.id, strategyId);
        if (success) {
          setCopyRelations(prev => ({
            ...prev,
            [strategyId]: !isCopying,
          }));
        }
        return success;
      } catch (error) {
        console.error('Error copying strategy:', error);
        return false;
      }
    },
    [user, copyRelations]
  );

  const handleStrategyClick = (strategyId: string) => {
    if (selectedStrategies.length > 0) {
      handleStrategySelect(strategyId);
    } else {
      navigate(`/strategies/${strategyId}`);
    }
  };

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

  const allStrategies = useMemo(
    () => [...topStrategies, ...aiSuggestedStrategies, ...popularStrategies],
    [topStrategies, aiSuggestedStrategies, popularStrategies]
  );

  const handleCompare = async () => {
    if (selectedStrategies.length > 1) {
      try {
        setIsComparing(true);
        const uniqueSelectedStrategies = selectedStrategies
          .map(id => allStrategies.find(s => s.id === id))
          .filter((s): s is ExtendedStrategy => s !== undefined);
        const comparison = await strategyService.compareStrategies(uniqueSelectedStrategies);
        setComparisonResult(comparison);
        setShowComparison(true);
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
        <CompareBar
          selectedStrategies={selectedStrategies}
          isComparing={isComparing}
          onCompare={handleCompare}
        />

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

        <div className="strategies-grid">
          {[...Array(activeTab === 'top' ? 3 : 5)].map((_, index) => (
            <SkeletonStrategyCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="strategies-section">
      <CompareBar
        selectedStrategies={selectedStrategies}
        isComparing={isComparing}
        onCompare={handleCompare}
      />

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
          strategies={topStrategies.map(strategy => ({
            ...strategy,
            isCopying: copyRelations[strategy.id] || false,
          }))}
          onCopy={handleCopyStrategy}
          onSelect={handleStrategySelect}
          onStrategyClick={handleStrategyClick}
          selectedStrategies={selectedStrategies}
        />
      )}
      {activeTab === 'ai' && (
        <SuggestedStrategiesSection
          strategies={aiSuggestedStrategies.map(strategy => ({
            ...strategy,
            isCopying: copyRelations[strategy.id] || false,
          }))}
          onCopy={handleCopyStrategy}
          onSelect={handleStrategySelect}
          onStrategyClick={handleStrategyClick}
          selectedStrategies={selectedStrategies}
        />
      )}
      {activeTab === 'popular' && (
        <PopularStrategiesSection
          strategies={popularStrategies.map(strategy => ({
            ...strategy,
            isCopying: copyRelations[strategy.id] || false,
          }))}
          onCopy={handleCopyStrategy}
          onSelect={handleStrategySelect}
          onStrategyClick={handleStrategyClick}
          selectedStrategies={selectedStrategies}
        />
      )}
      {comparisonResult && (
        <StrategyComparison
          comparison={comparisonResult}
          isOpen={showComparison}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}
