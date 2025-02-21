import React, { useState } from "react";
import { useViewport } from "@/hooks";
import "./Reports.css";
import TabNavigation from "@components/navigation/TabNavigation";
import OpenPositions from "@modules/OpenPositions/OpenPositions";
import { Statement } from "@/modules/Statement";
import { BREAKPOINTS } from "@/constants";

const tabs = [
  { label: "Open Positions", key: "open-positions" },
  { label: "Statements", key: "statements" },
  { label: "Copier Overview", key: "copier-overview" },
];

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const { width } = useViewport();

  const activeTabLabel =
    tabs.find((tab) => tab.key === activeTab)?.label || tabs[0].label;

  const handleTabChange = (newLabel: string) => {
    const foundTab = tabs.find((tab) => tab.label === newLabel);
    if (foundTab) {
      setActiveTab(foundTab.key);
    }
  };

  return (
    <div className="reports-container">
      <div className="reports-sidebar">
        <TabNavigation
          tabs={tabs.map((tab) => tab.label)}
          activeTab={activeTabLabel}
          onTabChange={handleTabChange}
          orientation={width >= BREAKPOINTS.DESKTOP ? "vertical" : "horizontal"}
        />
      </div>
      <div className="reports-content">
        {activeTab === "open-positions" && <OpenPositions />}
        {activeTab === "statements" && <Statement />}
        {activeTab === "copier-overview" && <div>Copier Overview Content</div>}
      </div>
    </div>
  );
};

export default Reports;
