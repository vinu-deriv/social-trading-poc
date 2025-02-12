export interface TradingPreferences {
  riskTolerance: "low" | "medium" | "high";
  investmentStyle: "conservative" | "moderate" | "aggressive";
  preferredMarkets: string[];
  tradingFrequency: "daily" | "weekly" | "monthly";
  maxDrawdown: number; // percentage
  targetReturn: number; // percentage per year
  minStake: number; // minimum stake per trade
  maxStake: number; // maximum stake per trade
}

export const MARKET_OPTIONS = [
  "Forex",
  "Stocks",
  "Cryptocurrencies",
  "Commodities",
  "Indices"
] as const;

export type WelcomeStep = "welcome" | "preferences" | "risk";
