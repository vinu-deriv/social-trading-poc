import type { Strategy, StrategyComparison } from '../types/strategy.types';

class StrategyService {
  private readonly API_URL = import.meta.env.VITE_LLM_SERVER_URL;

  async compareStrategies(strategies: Strategy[]): Promise<StrategyComparison> {
    try {
      const response = await fetch(`${this.API_URL}/api/compare-strategies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ strategies }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to compare strategies');
      }

      if (!data.comparison) {
        throw new Error('Invalid response format - missing comparison data');
      }

      return data.comparison as StrategyComparison;
    } catch (error) {
      console.error('Error comparing strategies:', error);
      throw error;
    }
  }
}

export const strategyService = new StrategyService();
