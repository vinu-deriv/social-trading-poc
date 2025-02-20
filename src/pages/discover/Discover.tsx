import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import TabNavigation from '../../components/navigation/TabNavigation';
import LeadersSection from './components/LeadersSection';
import StrategiesSection from './components/StrategiesSection';
import TrendingAssets from './components/TrendingAssets';
import PeopleSection from './components/PeopleSection';
import type { Asset } from '@/modules/discover/services/discoverService';
import './Discover.css';

export default function Discover() {
  const [activeTab, setActiveTab] = useState<string>('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLeader, setIsLeader] = useState(false);

  const JSON_SERVER_URL = import.meta.env.VITE_JSON_SERVER_URL;
  const LLM_SERVER_URL = import.meta.env.VITE_LLM_SERVER_URL;

  if (!JSON_SERVER_URL) {
    throw new Error('VITE_JSON_SERVER_URL environment variable is not set');
  }
  if (!LLM_SERVER_URL) {
    throw new Error('VITE_LLM_SERVER_URL environment variable is not set');
  }

  const { user } = useAuth();

  const tabs = isLeader
    ? ['People', 'Trending Assets']
    : ['People', 'Leaders', 'Strategies', 'Trending Assets'];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    // Set initial active tab to People for both Leaders and Copiers
    setActiveTab('People');
  }, []);

  useEffect(() => {
    const checkUserType = async () => {
      if (user) {
        try {
          const response = await fetch(`${JSON_SERVER_URL}/users/${user.id}`);
          const userData = await response.json();
          setIsLeader(userData.userType === 'leader');
        } catch (error) {
          console.error('Error checking user type:', error);
        }
      }
    };

    checkUserType();
  }, [user, JSON_SERVER_URL]);

  // Fetch trending assets separately
  useEffect(() => {
    const fetchTrendingAssets = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${LLM_SERVER_URL}/api/market/trending-assets`);
        const data = await response.json();
        if (data.length > 0) {
          setAssets(data.slice(0, 5)); // Get only top 4 assets
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trending assets:', error);
        setLoading(false);
      }
    };

    if (activeTab === 'Trending Assets') {
      fetchTrendingAssets();
    }
  }, [activeTab]);

  return (
    <div className="discover">
      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
      {activeTab === 'People' ? (
        <PeopleSection />
      ) : activeTab === 'Leaders' ? (
        <LeadersSection />
      ) : activeTab === 'Strategies' ? (
        <StrategiesSection />
      ) : (
        <TrendingAssets loading={loading} assets={assets} />
      )}
    </div>
  );
}
