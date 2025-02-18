import React from 'react';
import RandomValue from '@/components/RandomValue';
import { BaseContract } from '@/types/contract.types';
import './OptionOpenPosition.css';
import CountdownTimer from '@/components/CountdownTimer';

type OptionOpenPositionProps = BaseContract & {
  onSell: (id: string) => void;
};

const OptionOpenPosition: React.FC<OptionOpenPositionProps> = ({
  contractId,
  symbol,
  stake,
  leader,
  strategyName,
  currency,
  onSell,
}) => {
  return (
    <div className="option-position">
      <div className="position-info">
        <div className="info-item">
          <span className="info-label">Placed by:</span>
          <span className="info-value">{leader}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Strategy:</span>
          <span className="info-value">{strategyName}</span>
        </div>
      </div>

      <div className="position-header">
        <div className="symbol-section">
          <svg
            className="chart-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#85acb0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span className="symbol-text">{symbol}</span>
        </div>
      </div>

      <div className="contract-details">
        <div className="detail-item">
          <span className="detail-label">Ref. ID</span>
          <span className="detail-value">{contractId}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Contract value:</span>
          <span className="detail-value">{<RandomValue />}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Currency:</span>
          <div className="options-currency-badge">{currency}</div>
        </div>
        <div className="detail-item">
          <span className="detail-label">Stake:</span>
          <span className="detail-value">{stake}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Potential payout:</span>
          <span className="detail-value">-</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Remaining time:</span>
          <span className="detail-value">
            <CountdownTimer key={contractId} />
          </span>
        </div>
      </div>

      <div className="total-section">
        <span className="total-label">Total profit/loss:</span>
        <span className="total-value">{<RandomValue />}</span>
      </div>

      <button className="sell-button" onClick={() => onSell(contractId)}>
        Sell
      </button>
    </div>
  );
};

export default OptionOpenPosition;
