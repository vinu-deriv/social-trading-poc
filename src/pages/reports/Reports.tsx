import React, { useState } from 'react';
import './Reports.css';
import TabNavigation from '@components/navigation/TabNavigation';
import OpenPositions from '@modules/OpenPositions/OpenPositions';
import { Statement } from '@/modules/Statement';
import Statistics from '@modules/Statistics/Statistics';
import { UserType } from '@/types/user.types';

const tabs = [
  { label: 'Open Positions', key: 'open-positions' },
  { label: 'Statements', key: 'statements' },
  { label: 'Statistics', key: 'statistics' },
];

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const auth = JSON.parse(localStorage.getItem('auth') || 'false');
  const userId = auth.user.id;
  const activeTabLabel = tabs.find(tab => tab.key === activeTab)?.label || tabs[0].label;

  const handleTabChange = (newLabel: string) => {
    const foundTab = tabs.find(tab => tab.label === newLabel);
    if (foundTab) {
      setActiveTab(foundTab.key);
    }
  };

  return (
    <div className="reports">
      <TabNavigation
        tabs={tabs.map(tab => tab.label)}
        activeTab={activeTabLabel}
        onTabChange={handleTabChange}
      />
      <div className="reports-content">
        {activeTab === 'open-positions' && <OpenPositions />}
        {activeTab === 'statements' && <Statement />}
        {activeTab === 'statistics' && (
          <Statistics userId={userId} userType={auth.user.userType as UserType} />
        )}
      </div>
    </div>
  );
};

export default Reports;
