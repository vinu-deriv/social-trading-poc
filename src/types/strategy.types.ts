export interface TradingStrategy {
    id: string;
    leaderId: string;
    accountId: string; // Reference to the currency account
    name: string;
    description: string;
    tradeType: string; // Unique identifier for the strategy type
    riskLevel: "low" | "medium" | "high";
    performance: {
        totalReturn: number;
        winRate: number;
        averageProfit: number;
    };
    copiers: string[]; // Array of copier IDs
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
