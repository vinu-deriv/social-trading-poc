import { FC } from 'react';
import StrategyListItem from '@/components/strategy/StrategyListItem';
import type { ExtendedStrategy } from '@/types/strategy.types';
import '../shared.css';

interface TopStrategiesProps {
  strategies: ExtendedStrategy[];
  onCopy: (strategyId: string) => Promise<boolean>;
  onSelect: (strategyId: string) => void;
  onStrategyClick: (strategyId: string) => void;
  selectedStrategies: string[];
}

const TopStrategiesSection: FC<TopStrategiesProps> = ({
  strategies,
  onCopy,
  onSelect,
  onStrategyClick,
  selectedStrategies,
}) => {
  return (
    <div className="strategies-grid">
      {strategies.map((strategy, index) => (
        <StrategyListItem
          key={strategy.id}
          strategy={strategy}
          rank={index + 1}
          showCopyButton={true}
          isCopying={strategy.isCopying}
          onCopy={onCopy}
          onClick={onStrategyClick}
          onSelect={() => onSelect(strategy.id)}
          selected={selectedStrategies.includes(strategy.id)}
        />
      ))}
    </div>
  );
};

export default TopStrategiesSection;
