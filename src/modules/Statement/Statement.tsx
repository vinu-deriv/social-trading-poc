import Table from '../../components/Table/Table';
import dbData from '../../../json-server/data/db.json';
import { formatTimestamp } from '@/utils';
import { useViewport } from '@/hooks';
import { BREAKPOINTS } from '@/constants';
import { ContractCard } from '../OpenPositions/components/TradePositions/ContractCard';

interface StatementItem {
  type: string;
  reference_id: string | number;
  currency: string;
  transaction_time: string;
  action_type: string;
  amount: number;
  balance_after: number;
}

const Statement = () => {
  const statements = (dbData.statements || []) as StatementItem[];
  const { width } = useViewport();

  // Define columns as an array of header strings since our Table component expects string[]
  const columns = [
    'Type',
    'Ref. ID',
    'Currency',
    'Transaction time',
    'Transaction',
    'Credit/Debit',
    'Balance',
  ];

  // Map each statement object to an array of values matching the column order
  const data = statements.map((statement: StatementItem) => [
    statement.type,
    statement.reference_id,
    statement.currency,
    formatTimestamp(statement.transaction_time.toString()),
    statement.action_type,
    statement.amount,
    statement.balance_after,
  ]);

  return width >= BREAKPOINTS.DESKTOP ? (
    <Table columns={columns} data={data} />
  ) : (
    <div className="contract-card-container">
      {data.map((item, index) => {
        const items = columns.map((column, idx) => {
          return {
            title: column,
            value: item[idx],
          };
        });
        return <ContractCard items={items} key={index} />;
      })}
    </div>
  );
};

export default Statement;
