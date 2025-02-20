import AIStrategiesSection from './AIStrategiesSection';
import type { ExtendedStrategy } from '@/types/strategy.types';

export interface AIStrategiesProps {
  strategies: ExtendedStrategy[];
  onCopy: (strategyId: string) => Promise<void>;
  onSelect: (strategyId: string) => void;
  onStrategyClick: (strategyId: string) => void;
  selectedStrategies: string[];
}

export default AIStrategiesSection;
