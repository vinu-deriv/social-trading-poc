import React from 'react';
import './MultiplierOpenPosition.css';
import RandomValue from '@/components/RandomValue';
import { MultiplierContract } from '@/types/contract.types';

type MultiplierOpenPositionProps = MultiplierContract & {
  onClose: (id: string) => void;
};

const MultiplierOpenPosition: React.FC<MultiplierOpenPositionProps> = ({
  contractId,
  symbol,
  multiplier,
  contractCost,
  stake,
  leader,
  strategyName,
  currency,
  onClose,
}) => {
  return (
    <div className="multiplier-position">
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
        <div className="multiplier-section">
          <div className="multiplier-text">Multipliers</div>
          <div>
            <svg
              className="multiplier-arrow"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
            Up x{multiplier}
          </div>
        </div>
      </div>

      <div className="currency-badge">{currency}</div>

      <div className="contract-details">
        <div className="detail-item">
          <span className="detail-label">Contract cost:</span>
          <span className="detail-value">{contractCost}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Contract value:</span>
          <span className="detail-value">{<RandomValue />}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Deal cancel fee:</span>
          <span className="detail-value">{'-'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Stake:</span>
          <span className="detail-value">{stake}</span>
        </div>
      </div>

      <div className="total-section">
        <span className="total-label">Total profit/loss:</span>
        <span className="total-value">{<RandomValue />}</span>
      </div>

      <button className="close-button" onClick={() => onClose(contractId)}>
        Close
      </button>
    </div>
  );
};

export default MultiplierOpenPosition;
