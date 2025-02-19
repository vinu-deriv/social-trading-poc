import Table from '@/components/Table';
import { BaseContract, MultiplierContract } from '@/types/contract.types';
import { useTradePositionsDataMapper } from '../../hooks';
import { useViewport } from '@/hooks';
import { BREAKPOINTS } from '@/constants';
import { TradeType } from '../../types';
import './TradePositions.css';
import MultiplierOpenPosition from '../MultiplierOpenPosition';
import OptionOpenPosition from '../OptionOpenPosition';
import AccumulatorOpenPosition from '../AccumulatorOpenPosition';

interface PositionsTableProps {
  contracts: MultiplierContract[] & BaseContract[];
  tradeType: TradeType;
}

const TradePositions = ({ contracts, tradeType }: PositionsTableProps) => {
  const {
    multiplierContracts,
    tableViewedMultiplierContracts,
    optionContracts,
    tableViewedOptionContracts,
    accumulatorContracts,
    tableViewedAccumulatorContracts,
    removeContract,
  } = useTradePositionsDataMapper(contracts);
  const { width } = useViewport();

  const renderContracts = () => {
    if (tradeType === TradeType.Multipliers) {
      return multiplierContracts.map(contract => (
        <MultiplierOpenPosition {...contract} onClose={removeContract} key={contract.contractId} />
      ));
    }

    if (tradeType === TradeType.Accumulators) {
      return accumulatorContracts.map(contract => (
        <AccumulatorOpenPosition {...contract} onSell={removeContract} key={contract.contractId} />
      ));
    }

    return optionContracts.map(contract => (
      <OptionOpenPosition {...contract} onSell={removeContract} key={contract.contractId} />
    ));
  };

  const renderTables = () => {
    if (tradeType === TradeType.Multipliers) {
      return <Table data={tableViewedMultiplierContracts} />;
    }

    if (tradeType === TradeType.Accumulators) {
      return <Table data={tableViewedAccumulatorContracts} />;
    }

    return <Table data={tableViewedOptionContracts} />;
  };

  return width >= BREAKPOINTS.DESKTOP ? (
    renderTables()
  ) : (
    <div className="contract-card-container">{renderContracts()}</div>
  );
};

export default TradePositions;
