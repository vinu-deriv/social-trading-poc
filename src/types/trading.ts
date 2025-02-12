export interface TradingPreferences {
  riskTolerance: "low" | "medium" | "high";
  investmentStyle: "conservative" | "moderate" | "aggressive";
  preferredMarkets: string[];
  preferredTradeTypes: string[];
  tradingFrequency: "daily" | "weekly" | "monthly";
  maxDrawdown: number; // percentage
  targetReturn: number; // percentage per year
  minStake: number; // minimum stake per trade
  maxStake: number; // maximum stake per trade
}

export const MARKET_OPTIONS = [
  "Forex",
  "Stocks-Indices",
  "Cryptocurrencies",
  "Commodities",
  "Indices",
  "Derived-Synthetics"
] as const;

export const TRADE_TYPE_OPTIONS = [
  "Accumulators",
  "Vanillas",
  "Turbos",
  "Multipliers",
  "Rise/Fall",
  "Higher/Lower",
  "Touch/No Touch",
  "Matches/Differs",
  "Even/Odd",
  "Over/Under"
] as const;

export const WELCOME_STEPS = {
  WELCOME: "welcome",
  PREFERENCES: "preferences",
  RISK: "risk",
} as const;

export type WelcomeStep = typeof WELCOME_STEPS[keyof typeof WELCOME_STEPS];
