import { useState } from "react";
import Dropdown from "@components/Dropdown/Dropdown";
import { TradePositions } from "./components/TradePositions";
import { tradeTypes } from "./constants";
import dbData from "../../../json-server/data/db.json";
import "./OpenPositions.css";

const OpenPositions = () => {
  const [selectedTradeType, setSelectedTradeType] = useState<
    keyof typeof tradeTypes
  >(tradeTypes.Options);

  const handleTradeTypeChange = (selected: string) => {
    setSelectedTradeType(selected as keyof typeof tradeTypes);
  };

  return (
    <div className="open-positions">
      <div className="open-positions-header">
        <Dropdown
          options={Object.values(tradeTypes)}
          selected={selectedTradeType}
          onSelect={handleTradeTypeChange}
        />
      </div>
      <TradePositions
        contracts={dbData.contracts || []}
        tradeType={selectedTradeType}
      />
    </div>
  );
};

export default OpenPositions;
