import type User from '@/types/user.types';
import type { CopyRelationship } from '@/types/copy.types';
import type { Strategy, TradeType } from '@/types/strategy.types';

export interface Asset {
  symbol: string;
  name: string;
  imageUrl: string;
  currentPrice: number;
  changePercentage: number;
  direction: 'up' | 'down';
}

interface CurrencyAccount {
  id: string;
  userId: string;
  currency: string;
  balance: number;
  tradingStrategies: string[];
  isActive: boolean;
}

const JSON_SERVER_URL = import.meta.env.VITE_JSON_SERVER_URL;
if (!JSON_SERVER_URL) {
  throw new Error('VITE_JSON_SERVER_URL environment variable is not set');
}

export interface Leader {
  id: string;
  username: string;
  profilePicture?: string;
  copiers: number;
  totalProfit: number;
  winRate: number;
  isFollowing: boolean;
}

export interface ExtendedStrategy extends Omit<Strategy, 'tradeType'> {
  tradeType: TradeType;
  leader?: {
    username: string;
    displayName: string;
    profilePicture?: string;
  };
  currency?: string;
  isFollowing?: boolean;
  isCopying?: boolean;
  score?: number;
}

export const discoverService = {
  async fetchUsers(userId?: string): Promise<User[]> {
    try {
      const usersRes = await fetch(`${JSON_SERVER_URL}/users`);
      const users = await usersRes.json();

      if (userId) {
        const currentUserRes = await fetch(`${JSON_SERVER_URL}/users/${userId}`);
        const currentUser = await currentUserRes.json();
        return users.map((user: User) => ({
          ...user,
          isFollowing: currentUser.following.includes(user.id),
        }));
      }

      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  async fetchStrategies(userId?: string): Promise<ExtendedStrategy[]> {
    try {
      const [strategiesRes, usersRes] = await Promise.all([
        fetch(`${JSON_SERVER_URL}/tradingStrategies`),
        fetch(`${JSON_SERVER_URL}/users`),
      ]);

      const [strategies, users] = await Promise.all([strategiesRes.json(), usersRes.json()]);

      let copyRelations: CopyRelationship[] = [];
      let currentUser: User | null = null;

      if (userId) {
        [copyRelations, currentUser] = await Promise.all([
          fetch(`${JSON_SERVER_URL}/copyRelationships?copierId=${userId}`).then(res => res.json()),
          fetch(`${JSON_SERVER_URL}/users/${userId}`).then(res => res.json()),
        ]);
      }

      return strategies.map((strategy: Strategy) => {
        const leader = users.find((u: User) => u.id === strategy.leaderId);
        const isCopying = copyRelations.some(rel => rel.strategyId === strategy.id);

        return {
          ...strategy,
          tradeType: 'multipliers' as TradeType,
          leader: leader
            ? {
                username: leader.username,
                displayName: leader.displayName,
                profilePicture: leader.profilePicture,
              }
            : undefined,
          isFollowing: currentUser?.following?.includes(strategy.leaderId) ?? false,
          isCopying,
        };
      });
    } catch (error) {
      console.error('Error fetching strategies:', error);
      return [];
    }
  },

  async fetchAssets(): Promise<Asset[]> {
    try {
      const assetsRes = await fetch(`${JSON_SERVER_URL}/assets`);
      return await assetsRes.json();
    } catch (error) {
      console.error('Error fetching assets:', error);
      return [];
    }
  },

  async toggleFollow(userId: string, leaderId: string) {
    try {
      // Get current leader and user data
      const [leaderRes, currentUserRes] = await Promise.all([
        fetch(`${JSON_SERVER_URL}/users/${leaderId}`),
        fetch(`${JSON_SERVER_URL}/users/${userId}`),
      ]);

      const leader = await leaderRes.json();
      const currentUser = await currentUserRes.json();

      // Update following/followers lists
      const isFollowing = currentUser.following.includes(leaderId);
      if (isFollowing) {
        leader.followers = leader.followers.filter((id: string) => id !== userId);
        currentUser.following = currentUser.following.filter((id: string) => id !== leaderId);
      } else {
        leader.followers.push(userId);
        currentUser.following.push(leaderId);
      }

      // Update both users in database
      await Promise.all([
        fetch(`${JSON_SERVER_URL}/users/${leaderId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leader),
        }),
        fetch(`${JSON_SERVER_URL}/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentUser),
        }),
      ]);

      return !isFollowing;
    } catch (error) {
      console.error('Error updating follow status:', error);
      throw error;
    }
  },

  async toggleCopyStrategy(userId: string, strategyId: string) {
    try {
      // Get current strategy data
      const strategyRes = await fetch(`${JSON_SERVER_URL}/tradingStrategies/${strategyId}`);
      const strategy = await strategyRes.json();

      // Check if relationship already exists
      const relationshipId = `${userId}-${strategyId}`;
      const existingRes = await fetch(`${JSON_SERVER_URL}/copyRelationships?id=${relationshipId}`);
      const existing = await existingRes.json();

      if (existing.length > 0) {
        // Delete existing relationship
        await fetch(`${JSON_SERVER_URL}/copyRelationships/${relationshipId}`, {
          method: 'DELETE',
        });

        // Remove user from strategy copiers
        strategy.copiers = strategy.copiers.filter((id: string) => id !== userId);
        await fetch(`${JSON_SERVER_URL}/tradingStrategies/${strategyId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(strategy),
        });

        return false; // Not copying anymore
      } else {
        // Create new copy relationship
        const copyRelationship = {
          id: relationshipId,
          copierId: userId,
          leaderId: strategy.leaderId,
          strategyId: strategyId,
          copierAccountId: 'default', // You might want to let user select an account
          status: 'active',
          copySize: 1000, // Default copy size
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await fetch(`${JSON_SERVER_URL}/copyRelationships`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(copyRelationship),
        });

        // Add user to strategy copiers
        strategy.copiers.push(userId);
        await fetch(`${JSON_SERVER_URL}/tradingStrategies/${strategyId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(strategy),
        });

        return true; // Now copying
      }
    } catch (error) {
      console.error('Error copying strategy:', error);
      throw error;
    }
  },

  async getTopStrategies(userId?: string): Promise<ExtendedStrategy[]> {
    try {
      const strategies = await this.fetchStrategies(userId);

      // Calculate a composite score for each strategy
      const strategiesWithScore = strategies.map(strategy => {
        const maxReturn = Math.max(...strategies.map(s => Math.abs(s.performance.totalReturn)));
        const maxProfit = Math.max(...strategies.map(s => s.performance.averageProfit));
        const maxCopiers = Math.max(...strategies.map(s => s.copiers.length));

        // Calculate normalized scores (0-1)
        const returnScore = maxReturn ? Math.abs(strategy.performance.totalReturn) / maxReturn : 0;
        const winRateScore = strategy.performance.winRate / 100;
        const profitScore = maxProfit ? strategy.performance.averageProfit / maxProfit : 0;
        const copiersScore = maxCopiers ? strategy.copiers.length / maxCopiers : 0;

        // Risk level score
        const riskScore =
          strategy.riskLevel === 'low' ? 1 : strategy.riskLevel === 'medium' ? 0.66 : 0.33;

        // Weighted composite score
        const score =
          returnScore * 0.25 + // 25% weight for total return
          winRateScore * 0.25 + // 25% weight for win rate
          profitScore * 0.2 + // 20% weight for average profit
          riskScore * 0.15 + // 15% weight for risk level
          copiersScore * 0.15; // 15% weight for number of copiers

        return { ...strategy, score };
      });

      // Sort by composite score and return top 3
      return strategiesWithScore.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 3);
    } catch (error) {
      console.error('Error getting top strategies:', error);
      return [];
    }
  },

  async getTopLeaders(userId?: string): Promise<Leader[]> {
    try {
      const users = await this.fetchUsers(userId);
      const leaders = users
        .filter(u => u.userType === 'leader')
        .map(leader => ({
          id: leader.id,
          username: leader.username,
          profilePicture: leader.profilePicture,
          copiers: leader.followers?.length || 0,
          totalProfit: leader.performance?.totalPnL || 0,
          winRate: leader.performance?.winRate || 0,
          isFollowing: 'isFollowing' in leader ? (leader.isFollowing as boolean) : false,
        }));

      // Calculate composite score and sort
      const maxCopiers = Math.max(...leaders.map(l => l.copiers));
      const maxPnL = Math.max(...leaders.map(l => Math.abs(l.totalProfit)));

      const sortedLeaders = leaders.sort((a, b) => {
        const aCopiersScore = maxCopiers ? a.copiers / maxCopiers : 0;
        const bCopiersScore = maxCopiers ? b.copiers / maxCopiers : 0;

        const aWinRateScore = a.winRate / 100;
        const bWinRateScore = b.winRate / 100;

        const aPnLScore = maxPnL ? Math.abs(a.totalProfit) / maxPnL : 0;
        const bPnLScore = maxPnL ? Math.abs(b.totalProfit) / maxPnL : 0;

        const aScore = (aCopiersScore + aWinRateScore + aPnLScore) / 3;
        const bScore = (bCopiersScore + bWinRateScore + bPnLScore) / 3;

        return bScore - aScore;
      });

      return sortedLeaders.slice(0, 3);
    } catch (error) {
      console.error('Error getting top leaders:', error);
      return [];
    }
  },
};
