import { ExtendedStrategy } from '@/types/strategy.types';
import { UserType } from '@/types/user.types';
import { CopyRelationship } from '@/types/copy.types';
import { BaseContract } from '@/types/contract.types';

interface Statement {
  strategyId: string;
  userId: string;
  actionType: string;
  amount: number;
}

export interface StatisticsData {
  strategyId: string;
  title: string;
  data: {
    totalCopiers: number;
    totalPnL: number;
    winRate: number;
    strategyCount: number;
    totalInvestment: number;
  };
}

export const getStatistics = async (
  userId: string,
  userType: UserType
): Promise<StatisticsData[]> => {
  try {
    let strategies: ExtendedStrategy[] = [];

    if (userType === UserType.LEADER) {
      // For leaders, get strategies they created
      const stratResponse = await fetch(
        `${import.meta.env.VITE_JSON_SERVER_URL}/tradingStrategies?leaderId=${userId}`
      );
      if (!stratResponse.ok) {
        throw new Error('Failed to fetch strategies');
      }
      strategies = await stratResponse.json();
    } else {
      // For copiers, get strategies they copied
      const copyResponse = await fetch(
        `${import.meta.env.VITE_JSON_SERVER_URL}/copyRelationships?copierId=${userId}&status=active`
      );
      if (!copyResponse.ok) {
        throw new Error('Failed to fetch copy relationships');
      }
      const copyRelationships: CopyRelationship[] = await copyResponse.json();

      // Get all strategies that the copier is following
      const strategyIds = copyRelationships.map(rel => rel.strategyId);
      if (strategyIds.length > 0) {
        const stratResponse = await fetch(
          `${import.meta.env.VITE_JSON_SERVER_URL}/tradingStrategies?${strategyIds.map(id => `id=${id}`).join('&')}`
        );
        if (!stratResponse.ok) {
          throw new Error('Failed to fetch strategies');
        }
        strategies = await stratResponse.json();
      }
    }

    // Fetch statements
    const stmtResponse = await fetch(`${import.meta.env.VITE_JSON_SERVER_URL}/statements`);
    if (!stmtResponse.ok) {
      throw new Error('Failed to fetch statements');
    }
    const statements: Statement[] = await stmtResponse.json();

    // Fetch contracts (open positions)
    const contractResponse = await fetch(`${import.meta.env.VITE_JSON_SERVER_URL}/contracts`);
    if (!contractResponse.ok) {
      throw new Error('Failed to fetch contracts');
    }
    const contracts: BaseContract[] = await contractResponse.json();

    return strategies.map(strategy => {
      // Get all statements for this strategy
      const strategyStatements = statements.filter(
        stmt =>
          stmt.strategyId === strategy.id &&
          (userType === UserType.LEADER ? stmt.userId !== userId : stmt.userId === userId)
      );

      // Get all open contracts for this strategy
      const strategyContracts = contracts.filter(
        contract =>
          contract.strategyId === strategy.id &&
          (userType === UserType.LEADER ? contract.leaderId === userId : contract.leader === userId)
      );

      // Calculate total investment from buy transactions and open contracts
      const statementInvestment = strategyStatements
        .filter(stmt => stmt.actionType === 'buy')
        .reduce((sum, stmt) => sum + Math.abs(stmt.amount), 0);

      const contractInvestment = strategyContracts.reduce(
        (sum, contract) => sum + contract.stake,
        0
      );

      const totalInvestment = statementInvestment + contractInvestment;

      // Calculate total PnL from sell transactions
      const statementPnL = strategyStatements
        .filter(stmt => stmt.actionType === 'sell')
        .reduce((sum, stmt) => sum + stmt.amount, 0);

      // For open contracts, estimate PnL based on performance
      const contractPnL = strategyContracts.reduce((sum, contract) => {
        const estimatedReturn = contract.stake * (strategy.performance.totalReturn / 100);
        return sum + estimatedReturn;
      }, 0);

      const totalPnL = statementPnL + contractPnL;

      return {
        strategyId: strategy.id,
        title: strategy.name,
        data: {
          totalCopiers: strategy.copiers.length,
          totalPnL,
          winRate: strategy.performance.winRate,
          strategyCount: 1,
          totalInvestment,
        },
      };
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};
