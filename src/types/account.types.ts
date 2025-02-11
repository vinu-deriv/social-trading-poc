import TradingStrategy from "./strategy.types";

interface CurrencyAccount {
    id: string;
    userId: string;
    currency: string; // e.g., 'USD', 'EUR'
    balance: number;
    tradingStrategies: TradingStrategy[]; // Array of strategies for this currency (for leaders)
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default CurrencyAccount;
