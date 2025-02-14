import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import TabNavigation from "../../components/navigation/TabNavigation";
import Search from "./components/Search";
import LeadersSection from "./components/LeadersSection";
import StrategiesSection from "./components/StrategiesSection";
import TrendingAssets from "./components/TrendingAssets";
import { discoverService, Leader, ExtendedStrategy, Asset } from "../../modules/discover/services/discoverService";
import "./Discover.css";

export default function Discover() {
  const [activeTab, setActiveTab] = useState("Leaders");
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [strategies, setStrategies] = useState<ExtendedStrategy[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const tabs = ["Leaders", "Strategies", "Trending Assets"];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCopyStrategy = async (strategyId: string) => {
    if (!user) return;

    try {
      const isCopying = await discoverService.toggleCopyStrategy(user.id, strategyId);
      setStrategies(prevStrategies =>
        prevStrategies.map(s =>
          s.id === strategyId ? { ...s, isCopying } : s
        )
      );
    } catch (error) {
      console.error("Error copying strategy:", error);
    }
  };

  const handleFollowToggle = async (leaderId: string) => {
    if (!user) return;

    try {
      const isFollowing = await discoverService.toggleFollow(user.id, leaderId);
      
      // Update local state for both leaders and strategies
      setLeaders(prevLeaders =>
        prevLeaders.map(leader =>
          leader.id === leaderId ? { ...leader, isFollowing } : leader
        )
      );
      setStrategies(prevStrategies =>
        prevStrategies.map(strategy =>
          strategy.leaderId === leaderId ? { ...strategy, isFollowing } : strategy
        )
      );
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await discoverService.fetchAllData(user?.id);
        setLeaders(data.leaders);
        setStrategies(data.strategies);
        setAssets(data.assets);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="discover">
      <h1 className="discover__title">Discover</h1>
      <Search />
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      {activeTab === "Leaders" ? (
        <LeadersSection
          loading={loading}
          leaders={leaders}
          onFollow={handleFollowToggle}
        />
      ) : activeTab === "Strategies" ? (
        <StrategiesSection
          loading={loading}
          strategies={strategies}
          onFollow={handleFollowToggle}
          onCopy={handleCopyStrategy}
        />
      ) : (
        <TrendingAssets loading={loading} assets={assets} />
      )}
    </div>
  );
}
