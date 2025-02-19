export interface StrategyComparison {
  overview: {
    summary: string;
  };
  comparisonMatrix: {
    riskLevel: Record<string, 'low' | 'medium' | 'high'>;
    performance: Record<
      string,
      {
        totalReturn: number;
        winRate: number;
        averageProfit: number;
      }
    >;
  };
  recommendation: {
    allocation: Record<string, number>;
  };
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  leaderId: string;
  accountId: string;
  copiers: string[];
  winRate: number;
  totalPnL: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  minInvestment: number;
  maxInvestment: number;
  tradingPairs: string[];
  timeframe: string;
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

export default Strategy;
