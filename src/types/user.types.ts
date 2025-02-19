import type Strategy from './strategy.types';
import type { TradingPreferences } from './trading';

export enum UserType {
  LEADER = 'leader',
  COPIER = 'copier',
}

interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  profilePicture?: string;
  userType: UserType;
  followers?: string[]; // Array of user IDs
  following?: string[]; // Array of user IDs
  accounts?: string[]; // Array of account IDs
  strategies?: Strategy[]; // Array of strategies
  performance?: {
    winRate: number;
    totalPnL: number;
    monthlyReturn: number;
    totalTrades: number;
  };
  createdAt?: string;
  updatedAt?: string;
  isFirstLogin?: boolean;
  tradingPreferences?: TradingPreferences;
}

export default User;
