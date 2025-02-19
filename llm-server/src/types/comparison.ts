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
