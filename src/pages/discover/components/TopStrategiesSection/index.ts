import TopStrategiesSection from './TopStrategiesSection';
import type { ExtendedStrategy } from '@/types/strategy.types';

export interface TopStrategiesProps {
  strategies: ExtendedStrategy[];
  onCopy: (strategyId: string) => Promise<void>;
  onSelect: (strategyId: string) => void;
  onStrategyClick: (strategyId: string) => void;
  selectedStrategies: string[];
}

export default TopStrategiesSection;
