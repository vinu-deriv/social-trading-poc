import { useState, useEffect } from 'react';
import Chip from '@/components/Chip';
import { TradePositions } from './components/TradePositions';
import { TradeType } from './types';
import { contractService, ContractResponse } from '@/services/contractService';
import AILoader from '@/components/AILoader';
import ErrorState from '@/components/feedback/ErrorState';
import './OpenPositions.css';

const OpenPositions = () => {
  const [selectedTradeType, setSelectedTradeType] = useState<TradeType>(TradeType.Accumulators);
  const [contracts, setContracts] = useState<ContractResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const data = await contractService.getContracts(selectedTradeType);
        setContracts(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch contracts');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [selectedTradeType]);

  const handleTradeTypeChange = (selected: string) => {
    setSelectedTradeType(selected as TradeType);
  };

  if (loading) {
    return (
      <div className="open-positions">
        <div className="open-positions-header">
          <div className="open-positions-tabs">
            {Object.values(TradeType).map(type => (
              <Chip
                key={type}
                active={selectedTradeType === type}
                onClick={() => handleTradeTypeChange(type)}
              >
                {type}
              </Chip>
            ))}
          </div>
        </div>
        <div className="open-positions-loader">
          <AILoader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="open-positions">
        <div className="open-positions-header">
          <div className="open-positions-tabs">
            {Object.values(TradeType).map(type => (
              <Chip
                key={type}
                active={selectedTradeType === type}
                onClick={() => handleTradeTypeChange(type)}
              >
                {type}
              </Chip>
            ))}
          </div>
        </div>
        <ErrorState message={error} />
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="open-positions">
        <div className="open-positions-header">
          <div className="open-positions-tabs">
            {Object.values(TradeType).map(type => (
              <Chip
                key={type}
                active={selectedTradeType === type}
                onClick={() => handleTradeTypeChange(type)}
              >
                {type}
              </Chip>
            ))}
          </div>
        </div>
        <ErrorState
          message={`No open positions found for ${selectedTradeType}. Try selecting a different trade type or check back later.`}
        />
      </div>
    );
  }

  return (
    <div className="open-positions">
      <div className="open-positions-header">
        <div className="open-positions-tabs">
          {Object.values(TradeType).map(type => (
            <Chip
              key={type}
              active={selectedTradeType === type}
              onClick={() => handleTradeTypeChange(type)}
            >
              {type}
            </Chip>
          ))}
        </div>
      </div>
      <TradePositions contracts={contracts} tradeType={selectedTradeType} />
    </div>
  );
};

export default OpenPositions;
