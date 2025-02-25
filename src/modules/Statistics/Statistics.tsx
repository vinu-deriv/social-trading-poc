import React, { useEffect, useState } from 'react';
import { getStatistics, StatisticsData } from '@/services/statisticsService';
import StatisticsCard from './components/StatisticsCard';
import ProfitPieChart from './components/ProfitPieChart/ProfitPieChart';
import WinRatePieChart from './components/WinRatePieChart/WinRatePieChart';
import AILoader from '@/components/AILoader';
import { UserType } from '@/types/user.types';
import './Statistics.css';

interface StatisticsProps {
  userId: string;
  userType: UserType;
}

interface TotalData {
  totalCopiers: number;
  totalPnL: number;
  winRate: number;
  strategyCount: number;
  totalInvestment: number;
}

const Statistics: React.FC<StatisticsProps> = ({ userId, userType }) => {
  const [statistics, setStatistics] = useState<StatisticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getStatistics(userId, userType);
        setStatistics(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [userId, userType]);

  if (isLoading) {
    return (
      <div className="statistics-loader">
        <AILoader />
      </div>
    );
  }

  if (!statistics.length) {
    return null;
  }

  const totalData = statistics.reduce<TotalData>(
    (acc, curr) => ({
      totalCopiers: acc.totalCopiers + curr.data.totalCopiers,
      totalPnL: acc.totalPnL + curr.data.totalPnL,
      winRate: acc.winRate + curr.data.winRate,
      strategyCount: acc.strategyCount + curr.data.strategyCount,
      totalInvestment: acc.totalInvestment + curr.data.totalInvestment,
    }),
    {
      totalCopiers: 0,
      totalPnL: 0,
      winRate: 0,
      strategyCount: 0,
      totalInvestment: 0,
    }
  );

  const profitPieData = statistics.map(stat => ({
    name: stat.title,
    value: stat.data.totalPnL,
  }));

  const winRatePieData = statistics.map(stat => ({
    name: stat.title,
    value: stat.data.winRate,
  }));

  return (
    <div className="statistics">
      <div className="statistics-content">
        <StatisticsCard
          title="Overall Statistics"
          strategyId="all"
          userType={userType}
          data={{
            totalCopiers: totalData.totalCopiers,
            totalPnL: totalData.totalPnL,
            winRate: totalData.winRate / totalData.strategyCount,
            strategyCount: totalData.strategyCount,
            totalInvestment: totalData.totalInvestment,
          }}
        />
        <ProfitPieChart data={profitPieData} />
        <WinRatePieChart data={winRatePieData} />
      </div>
    </div>
  );
};

export default Statistics;
