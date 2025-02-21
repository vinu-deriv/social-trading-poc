import { useState } from 'react';
import Chip from '@/components/Chip';
import AllPeopleSection from '../AllPeopleSection/AllPeopleSection';
import SuggestedPeopleSection from '../SuggestedPeopleSection/SuggestedPeopleSection';
import './PeopleSection.css';

type PeopleTab = 'all' | 'suggested';

export default function PeopleSection() {
  const [activeTab, setActiveTab] = useState<PeopleTab>('all');

  return (
    <div className="people-section">
      <div className="people-section__tabs">
        <Chip active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
          All Users
        </Chip>
        <Chip active={activeTab === 'suggested'} onClick={() => setActiveTab('suggested')}>
          ✧ AI Suggested
        </Chip>
      </div>
      {activeTab === 'all' ? <AllPeopleSection /> : <SuggestedPeopleSection />}
    </div>
  );
}
