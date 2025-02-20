import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { discoverService } from '@/modules/discover/services/discoverService';
import { strategySuggestionsService } from '@/services/strategySuggestionsService';
import '../shared.css';
import './StrategiesSection.css';
import Chip from '@/components/Chip';
import type { ExtendedStrategy } from '@/types/strategy.types';
import TopStrategiesSection from '../TopStrategiesSection';
import SuggestedStrategiesSection from '../SuggestedStrategiesSection';
import PopularStrategiesSection from '../PopularStrategiesSection';
import SkeletonStrategyCard from '../SkeletonStrategyCard';

export default function StrategiesSection() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [topStrategies, setTopStrategies] = useState<ExtendedStrategy[]>([]);
  const [aiSuggestedStrategies, setAiSuggestedStrategies] = useState<ExtendedStrategy[]>([]);
  const [popularStrategies, setPopularStrategies] = useState<ExtendedStrategy[]>([]);
  type StrategyTab = 'top' | 'ai' | 'popular';
  const [activeTab, setActiveTab] = useState<StrategyTab>('top');

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        setLoading(true);

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
        console.error('Error fetching strategies:', error);
        setLoading(false);
      }
    };

    fetchStrategies();
  }, [activeTab, user]);

  const handleCopyStrategy = useCallback(
    async (strategyId: string): Promise<boolean> => {
      if (!user) return false;
      try {
        const isCopying = await discoverService.toggleCopyStrategy(user.id, strategyId);
        // Only update the active tab's strategies
        switch (activeTab) {
          case 'top':
            setTopStrategies(prev =>
              prev.map(s => (s.id === strategyId ? { ...s, isCopying } : s))
            );
            break;
          case 'ai':
            setAiSuggestedStrategies(prev =>
              prev.map(s => (s.id === strategyId ? { ...s, isCopying } : s))
            );
            break;
          case 'popular':
            setPopularStrategies(prev =>
              prev.map(s => (s.id === strategyId ? { ...s, isCopying } : s))
            );
            break;
        }
        return isCopying;
      } catch (error) {
        console.error('Error copying strategy:', error);
        return false;
      }
    },
    [user, activeTab]
  );

  if (loading) {
    return (
      <div className="strategies-section">
        <div className="strategies-section__tabs">
          <Chip active={activeTab === 'top'} onClick={() => setActiveTab('top')}>
            Top Strategies
          </Chip>
          <Chip active={activeTab === 'ai'} onClick={() => setActiveTab('ai')}>
            AI Suggested
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
        <TopStrategiesSection strategies={topStrategies} onCopy={handleCopyStrategy} />
      )}
      {activeTab === 'ai' && (
        <SuggestedStrategiesSection
          strategies={aiSuggestedStrategies}
          onCopy={handleCopyStrategy}
        />
      )}
      {activeTab === 'popular' && (
        <PopularStrategiesSection strategies={popularStrategies} onCopy={handleCopyStrategy} />
      )}
    </div>
  );
}
