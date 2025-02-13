import React from "react";
import { Contract } from "@/types/contract.types";
import { positionsTableColumns, TradeType } from "../../constants";
import Table from "@/components/Table";
import { TradePositionsDataMapper } from "./TradePositionsDataMapper";
import { ContractCard } from "./ContractCard";
import { useViewport } from "@/hooks";
import "./TradePositions.css";

interface PositionsTableProps {
  contracts: Contract[];
  tradeType: TradeType;
}

const TradePositions = ({ contracts, tradeType }: PositionsTableProps) => {
  const columns = positionsTableColumns[tradeType];
  const { isDesktop } = useViewport();

  return isDesktop ? (
    <Table
      columns={columns}
      data={TradePositionsDataMapper(contracts, tradeType)}
    />
  ) : (
    <div className="contract-card-container">
      {TradePositionsDataMapper(contracts, tradeType).map((item) => {
        const items = columns.map((column, idx) => {
          return {
            title: column,
            value: item[idx],
          };
        });
        return <ContractCard items={items} />;
      })}
    </div>
  );
};

export default TradePositions;
