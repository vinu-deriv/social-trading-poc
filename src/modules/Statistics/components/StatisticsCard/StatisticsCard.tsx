import React, { memo } from 'react';
import RandomValue from '@/components/RandomValue';
import './StatisticsCard.css';
import { UserType } from '@/types/user.types';

interface StatisticsCardProps {
  title: string;
  strategyId: string;
  userType: UserType;
  data: {
    totalCopiers: number;
    totalPnL: number;
    winRate: number;
    strategyCount: number;
    totalInvestment: number;
  };
}

export const StatisticsCard: React.FC<StatisticsCardProps> = memo(
  ({ title, data, strategyId, userType }) => {
    const { totalCopiers, totalPnL, winRate, strategyCount, totalInvestment } = data;

    return (
      <div className="statistics-card">
        <div className="statistics-card__header">
          <div className="statistics-card__header-main">
            <div className="statistics-card__type">
              <span className="statistics-card__type-text">{title}</span>
              {strategyId !== 'all' && (
                <span className="statistics-card__value">Strategy #{strategyId}</span>
              )}
            </div>
          </div>
        </div>

        <div className="statistics-card__content">
          <div className="statistics-card__info">
            <div className="statistics-card__row">
              <span className="statistics-card__label">Active Strategies</span>
              <span className="statistics-card__value">{strategyCount}</span>
            </div>

            {userType === UserType.LEADER && (
              <div className="statistics-card__row">
                <span className="statistics-card__label">Total Copiers</span>
                <span className="statistics-card__value">{totalCopiers}</span>
              </div>
            )}

            <div className="statistics-card__row">
              <span className="statistics-card__label">Average Win Rate</span>
              <span className="statistics-card__value">{winRate.toFixed(1)}%</span>
            </div>

            <div className="statistics-card__row">
              <span className="statistics-card__label">Total Investment</span>
              <span className="statistics-card__value">
                $
                {totalInvestment.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <div
            className={`statistics-card__section ${totalPnL >= 0 ? 'statistics-card__section--profit' : 'statistics-card__section--loss'}`}
          >
            <div className="statistics-card__row">
              <span className="statistics-card__label">Total PnL</span>
              <span className="statistics-card__amount">
                {totalPnL >= 0 ? '+$' : '-$'}
                <RandomValue
                  min={Math.abs(totalPnL * 0.95)}
                  max={Math.abs(totalPnL * 1.05)}
                  interval={1000}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

StatisticsCard.displayName = 'StatisticsCard';

export default StatisticsCard;
