import { useState } from 'react';
import { TradeType } from '../types';
import { MultiplierContract, BaseContract } from '@/types/contract.types';
import RandomValue from '@/components/RandomValue';
import CountdownTimer from '@/components/CountdownTimer';

type Contract = MultiplierContract & BaseContract;

const useTradePositionsDataMapper = (contracts: Contract[]) => {
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>(contracts);

  const removeContract = (contractId: string) => {
    setFilteredContracts(prevContracts =>
      prevContracts.filter(contract => contract.contractId !== contractId)
    );
  };

  const multiplierContracts = filteredContracts.filter(
    contract => contract.contractType === TradeType.Multipliers
  ) as MultiplierContract[];

  const optionContracts = filteredContracts.filter(
    contract => contract.contractType === TradeType.Options
  ) as BaseContract[];

  const accumulatorContracts = filteredContracts.filter(
    contract => contract.contractType === TradeType.Accumulators
  ) as BaseContract[];

  const tableViewedMultiplierContracts = multiplierContracts.map(contract => ({
    Type: contract.contractType, // "Type"
    Multiplier: contract.multiplier, // "Multiplier"
    'Ref. ID': contract.contractId, // "Ref. ID"
    Currency: contract.currency, // "Currency"
    'Contract cost': contract.contractCost, // "Contract cost"
    'Deal cancel. fee': '-', // "Deal cancel. fee"
    Stake: contract.stake, // "Stake"
    'Take profit/Stop loss': '-', // "Take profit/Stop loss"
    'Contract value': <RandomValue key={`cv-${contract.contractId}`} />, // "Contract value"
    'Total profit/loss': <RandomValue key={`tpl-${contract.contractId}`} />, // "Total profit/loss"
    Action: (
      <>
        <button
          className="contract-card-button"
          onClick={() => removeContract(contract.contractId)}
        >
          Close
        </button>
      </>
    ), // "Action"
  }));

  const tableViewedOptionContracts = optionContracts.map(contract => ({
    Type: contract.contractType, // "Type"
    'Ref. ID': contract.contractId, // "Ref. ID"
    Currency: contract.currency, // "Currency"
    Stake: contract.stake, // "Stake"
    'Potential payout': '-', // "Potential payout"
    'Total profit/loss': <RandomValue key={`tpl-${contract.contractId}`} />, // "Total profit/loss"
    'Contract value': <RandomValue key={`cv-${contract.contractId}`} />, // "Contract value"
    'Remaining time': <CountdownTimer key={contract.contractId} />, // "Remaining time"
    Action: (
      <>
        <button
          className="contract-card-button"
          onClick={() => removeContract(contract.contractId)}
        >
          Sell
        </button>
      </>
    ), // "Action"
  }));

  const tableViewedAccumulatorContracts = accumulatorContracts.map(contract => ({
    Type: contract.contractType, // "Type"
    'Ref. ID': contract.contractId, // "Ref. ID"
    'Growth rate': '1%', // "Growth rate"
    Currency: contract.currency, // "Currency"
    Stake: contract.stake, // "Stake"
    'Take profit': '-', // "Take profit"
    'Contract value': <RandomValue key={`cv-${contract.contractId}`} />, // "Contract value"
    'Total profit/loss': <RandomValue key={`tpl-${contract.contractId}`} />, // "Total profit/loss"
    Action: (
      <>
        <button
          className="contract-card-button"
          onClick={() => removeContract(contract.contractId)}
        >
          Sell
        </button>
      </>
    ), // "Action"
  }));

  return {
    multiplierContracts,
    tableViewedMultiplierContracts,
    optionContracts,
    tableViewedOptionContracts,
    accumulatorContracts,
    tableViewedAccumulatorContracts,
    removeContract,
  };
};

export default useTradePositionsDataMapper;
