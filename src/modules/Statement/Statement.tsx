import Table from '../../components/Table/Table';
import dbData from '../../../json-server/data/db.json';
import { formatTimestamp } from '@/utils';
import { useViewport } from '@/hooks';
import { BREAKPOINTS } from '@/constants';
import { StatementCard } from './components/StatementCard';
import './Statement.css';

interface StatementItem {
  type: string;
  referenceId: number;
  currency: string;
  transactionTime: string;
  actionType: string;
  amount: number;
  balanceAfter: number;
}

const Statement = () => {
  const statements = (dbData.statements || []) as StatementItem[];
  const { width } = useViewport();

  // Map each statement object to an array of values matching the column order
  const data = statements.map((statement: StatementItem) => ({
    Type: statement.type,
    'Ref. ID': statement.referenceId,
    Currency: statement.currency,
    'Transaction time': formatTimestamp(statement.transactionTime.toString()),
    Transaction: statement.actionType,
    'Credit/Debit': statement.amount,
    Balance: statement.balanceAfter,
  }));

  return width >= BREAKPOINTS.DESKTOP ? (
    <Table data={data} />
  ) : (
    <div className="statement-card-container">
      {statements.map(item => (
        <StatementCard {...item} />
      ))}
    </div>
  );
};

export default Statement;
