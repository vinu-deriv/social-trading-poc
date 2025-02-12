export const RISK_TOLERANCE_OPTIONS = [
  { value: "low", label: "Low - Safety First" },
  { value: "medium", label: "Medium - Balanced Approach" },
  { value: "high", label: "High - Maximum Growth" },
] as const;

export const INVESTMENT_STYLE_OPTIONS = [
  { value: "conservative", label: "Conservative" },
  { value: "moderate", label: "Moderate" },
  { value: "aggressive", label: "Aggressive" },
] as const;

export const TRADING_FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
] as const;
