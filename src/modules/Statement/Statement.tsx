import Table from "../../components/Table/Table";
import dbData from "../../../json-server/data/db.json";

interface StatementItem {
  type: string;
  reference_id: string | number;
  currency: string;
  transaction_time: number;
  action_type: string;
  amount: number;
  balance_after: number;
}

const Statement = () => {
  const statements = (dbData.statements || []) as StatementItem[];

  // Define columns as an array of header strings since our Table component expects string[]
  const columns = [
    "Type",
    "Ref. ID",
    "Currency",
    "Transaction time",
    "Transaction",
    "Credit/Debit",
    "Balance",
  ];

  // Map each statement object to an array of values matching the column order
  const data = statements.map((statement: StatementItem) => [
    statement.type,
    statement.reference_id,
    statement.currency,
    statement.transaction_time,
    statement.action_type,
    statement.amount,
    statement.balance_after,
  ]);

  return (
    <div className="statement">
      <Table columns={columns} data={data} />
    </div>
  );
};

export default Statement;
