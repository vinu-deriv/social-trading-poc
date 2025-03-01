import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import StrategyListItem from '@/components/strategy/StrategyListItem';
import type { ExtendedStrategy } from '@/types/strategy.types';
import '../shared.css';

interface AIStrategiesProps {
  strategies: ExtendedStrategy[];
  onCopy: (strategyId: string) => Promise<boolean>;
}

const AIStrategiesSection: FC<AIStrategiesProps> = ({ strategies, onCopy }) => {
  const navigate = useNavigate();

  return (
    <div className="strategies-grid">
      {strategies.map(strategy => (
        <StrategyListItem
          key={strategy.id}
          strategy={strategy}
          showCopyButton={true}
          isCopying={strategy.isCopying}
          onCopy={onCopy}
          onClick={id => navigate(`/strategies/${id}`)}
        />
      ))}
    </div>
  );
};

export default AIStrategiesSection;
