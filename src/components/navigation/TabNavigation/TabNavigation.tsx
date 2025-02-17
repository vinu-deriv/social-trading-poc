import "./TabNavigation.css";

interface TabNavigationProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  orientation?: "horizontal" | "vertical";
}

const TabNavigation = ({
  tabs,
  activeTab,
  onTabChange,
  orientation = "horizontal",
}: TabNavigationProps) => {
  return (
    <div className={`tab-navigation ${orientation}`}>
      <div className="tab-container">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
