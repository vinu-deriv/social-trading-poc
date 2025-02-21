import PopularStrategiesSection from './PopularStrategiesSection';
import type { ExtendedStrategy } from '@/types/strategy.types';

export interface PopularStrategiesProps {
  strategies: ExtendedStrategy[];
  onCopy: (strategyId: string) => Promise<void>;
  onSelect: (strategyId: string) => void;
  onStrategyClick: (strategyId: string) => void;
  selectedStrategies: string[];
}

export default PopularStrategiesSection;
