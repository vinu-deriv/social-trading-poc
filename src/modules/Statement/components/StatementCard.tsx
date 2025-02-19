import React from 'react';
import { formatTimestamp } from '../../../utils/time';
import './StatementCard.css';

interface StatementCardProps {
  type: string;
  actionType: string;
  currency: string;
  amount: number;
  balanceAfter: number;
  referenceId: number;
  transactionTime: string;
}

export const StatementCard: React.FC<StatementCardProps> = ({
  type,
  actionType,
  currency,
  amount,
  balanceAfter,
  referenceId,
  transactionTime,
}) => {
  return (
    <div className="statement-card">
      <div className="statement-card__header">
        <div className="statement-card__type">
          <span className="statement-card__type-text">{type}</span>
        </div>
        <div className={`statement-card__action ${actionType.toLowerCase()}`}>{actionType}</div>
      </div>

      <div className="statement-card__content">
        <div className="statement-card__row">
          <span className="statement-card__label">Ref. ID</span>
          <span className="statement-card__value">{referenceId}</span>
        </div>

        <div className="statement-card__row">
          <span className="statement-card__label">Transaction time</span>
          <span className="statement-card__value">{formatTimestamp(transactionTime)}</span>
        </div>

        <div className="statement-card__row">
          <span className="statement-card__label">Currency</span>
          <span className="statement-card__currency">{currency}</span>
        </div>

        <div className="statement-card__row">
          <span className="statement-card__label">Credit/Debit</span>
          <span className={`statement-card__amount ${amount < 0 ? 'negative' : 'positive'}`}>
            {amount < 0 ? amount : `+${amount}`}
          </span>
        </div>

        <div className="statement-card__row">
          <span className="statement-card__label">Balance</span>
          <span className="statement-card__balance">{balanceAfter.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
