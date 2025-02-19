import React from 'react';
import type { TradingPreferences } from '@/types/trading';
import './ProfileTradingPreferences.css';

interface ProfileTradingPreferencesProps {
  preferences: TradingPreferences;
}

interface StatItemProps {
  label: string;
  value: string | number;
  formatter?: (value: number) => string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, formatter }) => (
  <div className="profile-trading-preferences__stat">
    <span className="profile-trading-preferences__label">{label}</span>
    <span className="profile-trading-preferences__value">
      {formatter ? formatter(value as number) : value}
    </span>
  </div>
);

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercentage = (value: number): string => `${value}%`;

const ProfileTradingPreferences: React.FC<ProfileTradingPreferencesProps> = ({ preferences }) => {
  const stats: StatItemProps[] = [
    { label: 'Risk Tolerance', value: preferences.riskTolerance },
    { label: 'Investment Style', value: preferences.investmentStyle },
    { label: 'Trading Frequency', value: preferences.tradingFrequency },
    { label: 'Max Drawdown', value: preferences.maxDrawdown, formatter: formatPercentage },
    { label: 'Target Return', value: preferences.targetReturn, formatter: formatPercentage },
    { label: 'Min Stake', value: preferences.minStake, formatter: formatCurrency },
    { label: 'Max Stake', value: preferences.maxStake, formatter: formatCurrency },
  ];

  return (
    <div className="profile-trading-preferences">
      {stats.map(stat => (
        <StatItem
          key={stat.label}
          label={stat.label}
          value={stat.value}
          formatter={stat.formatter}
        />
      ))}
    </div>
  );
};

export default ProfileTradingPreferences;
