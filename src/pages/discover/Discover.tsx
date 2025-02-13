import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { CopyRelationship } from "../../types/copy.types";
import AiGif from "../../assets/icons/ai.gif";
import SkeletonCard from "./components/SkeletonCard";
import LeaderCard from "./components/LeaderCard";
import StrategyCard from "./components/StrategyCard";
import TabNavigation from "../../components/navigation/TabNavigation";
import "./Discover.css";

interface Leader {
  id: string;
  username: string;
  avatar?: string;
  copiers: number;
  totalProfit: number;
  winRate: number;
  isFollowing: boolean;
}

interface User {
  id: string;
  username: string;
  displayName: string;
  profilePicture?: string;
  userType: string;
  following: string[];
  followers: string[];
}

interface CurrencyAccount {
  id: string;
  userId: string;
  currency: string;
  balance: number;
  tradingStrategies: string[];
  isActive: boolean;
}

interface TradingStrategy {
  id: string;
  leaderId: string;
  accountId: string;
  name: string;
  description: string;
  tradeType: string;
  riskLevel: string;
  copiers: string[];
  isActive: boolean;
}

interface Strategy {
  id: string;
  leaderId: string;
  accountId: string;
  name: string;
  description: string;
  tradeType: string;
  copiers: string[];
  leader?: {
    username: string;
    displayName: string;
    profilePicture?: string;
  };
  currency?: string;
  isFollowing?: boolean;
  isCopying?: boolean;
}

export default function Discover() {
  const [activeTab, setActiveTab] = useState("Leaders");
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const tabs = ["Leaders", "Strategies"];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCopyStrategy = useCallback(
    async (strategyId: string) => {
      if (!user) return;

      try {
        // Get current strategy data
        const strategyRes = await fetch(
          `http://localhost:3001/tradingStrategies/${strategyId}`
        );
        const strategy = await strategyRes.json();

        // Check if relationship already exists
        const relationshipId = `${user.id}-${strategyId}`;
        const existingRes = await fetch(
          `http://localhost:3001/copyRelationships?id=${relationshipId}`
        );
        const existing = await existingRes.json();

        if (existing.length > 0) {
          // Delete existing relationship
          await fetch(
            `http://localhost:3001/copyRelationships/${relationshipId}`,
            {
              method: "DELETE",
            }
          );

          // Remove user from strategy copiers
          strategy.copiers = strategy.copiers.filter(
            (id: string) => id !== user.id
          );
          await fetch(`http://localhost:3001/tradingStrategies/${strategyId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(strategy),
          });

          // Update local state to show "Copy Strategy"
          setStrategies((prevStrategies) =>
            prevStrategies.map((s) =>
              s.id === strategyId ? { ...s, isCopying: false } : s
            )
          );
        } else {
          // Create new copy relationship
          const copyRelationship = {
            id: relationshipId,
            copierId: user.id,
            leaderId: strategy.leaderId,
            strategyId: strategyId,
            copierAccountId: "default", // You might want to let user select an account
            status: "active",
            copySize: 1000, // Default copy size
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          await fetch("http://localhost:3001/copyRelationships", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(copyRelationship),
          });

          // Add user to strategy copiers
          strategy.copiers.push(user.id);
          await fetch(`http://localhost:3001/tradingStrategies/${strategyId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(strategy),
          });

          // Update local state to show "Stop Copying"
          setStrategies((prevStrategies) =>
            prevStrategies.map((s) =>
              s.id === strategyId ? { ...s, isCopying: true } : s
            )
          );
        }
      } catch (error) {
        console.error("Error copying strategy:", error);
      }
    },
    [user]
  );

  const handleFollowToggle = useCallback(
    async (leaderId: string) => {
      if (!user) return;

      try {
        // Get current leader and user data
        const [leaderRes, currentUserRes] = await Promise.all([
          fetch(`http://localhost:3001/users/${leaderId}`),
          fetch(`http://localhost:3001/users/${user.id}`),
        ]);

        const leader = await leaderRes.json();
        const currentUser = await currentUserRes.json();

        // Update following/followers lists
        const isFollowing = currentUser.following.includes(leaderId);
        if (isFollowing) {
          // Unfollow: Remove from lists
          leader.followers = leader.followers.filter(
            (id: string) => id !== user.id
          );
          currentUser.following = currentUser.following.filter(
            (id: string) => id !== leaderId
          );
        } else {
          // Follow: Add to lists
          leader.followers.push(user.id);
          currentUser.following.push(leaderId);
        }

        // Update both users in database
        await Promise.all([
          fetch(`http://localhost:3001/users/${leaderId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(leader),
          }),
          fetch(`http://localhost:3001/users/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentUser),
          }),
        ]);

        // Update local state for both leaders and strategies
        setLeaders((prevLeaders) =>
          prevLeaders.map((leader) =>
            leader.id === leaderId
              ? { ...leader, isFollowing: !leader.isFollowing }
              : leader
          )
        );
        setStrategies((prevStrategies) =>
          prevStrategies.map((strategy) =>
            strategy.leaderId === leaderId
              ? { ...strategy, isFollowing: !strategy.isFollowing }
              : strategy
          )
        );
      } catch (error) {
        console.error("Error updating follow status:", error);
      }
    },
    [user]
  );

  // Memoized sections
  const topLeaders = useMemo(() => {
    return [...leaders]
      .sort((a, b) => b.totalProfit - a.totalProfit)
      .slice(0, 3);
  }, [leaders]);

  const aiSuggestedLeaders = useMemo(() => {
    return [...leaders].sort(() => Math.random() - 0.5).slice(0, 5);
  }, [leaders]);

  const topEarners = useMemo(() => {
    return [...leaders].sort(() => Math.random() - 0.5).slice(0, 5);
  }, [leaders]);

  const mostPopular = useMemo(() => {
    return [...leaders].sort(() => Math.random() - 0.5).slice(0, 5);
  }, [leaders]);

  // Strategy sections
  const topStrategies = useMemo(() => {
    return [...strategies]
      .sort((a, b) => b.copiers.length - a.copiers.length)
      .slice(0, 3);
  }, [strategies]);

  const aiSuggestedStrategies = useMemo(() => {
    return [...strategies].sort(() => Math.random() - 0.5).slice(0, 5);
  }, [strategies]);

  const popularStrategies = useMemo(() => {
    return [...strategies].sort(() => Math.random() - 0.5).slice(0, 5);
  }, [strategies]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, strategiesRes, currencyAccountsRes] =
          await Promise.all([
            fetch("http://localhost:3001/users"),
            fetch("http://localhost:3001/tradingStrategies"),
            fetch("http://localhost:3001/currencyAccounts"),
          ]);

        const [users, strategiesData, accounts]: [
          User[],
          TradingStrategy[],
          CurrencyAccount[]
        ] = await Promise.all([
          usersRes.json(),
          strategiesRes.json(),
          currencyAccountsRes.json(),
        ]);

        // Get current user data to check following status
        const currentUserData = user
          ? await fetch(`http://localhost:3001/users/${user.id}`).then((res) =>
              res.json()
            )
          : null;

        // Process leaders
        const leaders = users
          .filter((u) => u.userType === "leader")
          .map((leader) => ({
            id: leader.id,
            username: leader.username,
            avatar: leader.profilePicture,
            copiers: Math.floor(Math.random() * 2000) + 500,
            totalProfit: Math.floor(Math.random() * 900000) + 100000,
            winRate: Math.floor(Math.random() * 20) + 70,
            isFollowing: currentUserData
              ? currentUserData.following.includes(leader.id)
              : false,
          }));

        // Process strategies
        // Get copy relationships for current user
        const copyRelationsRes = await fetch(
          `http://localhost:3001/copyRelationships?copierId=${user?.id}`
        );
        const copyRelations = await copyRelationsRes.json();

        const processedStrategies = strategiesData.map((strategy) => {
          const leader = users.find((u) => u.id === strategy.leaderId);
          const account = accounts.find((a) => a.id === strategy.accountId);
          console.log(account, "strategy", accounts, strategy.accountId);
          const isCopying = copyRelations.some(
            (rel: CopyRelationship) => rel.strategyId === strategy.id
          );
          return {
            ...strategy,
            leader: leader
              ? {
                  username: leader.username,
                  displayName: leader.displayName,
                  profilePicture: leader.profilePicture,
                }
              : undefined,
            currency: account?.currency,
            isFollowing: currentUserData
              ? currentUserData.following.includes(strategy.leaderId)
              : false,
            isCopying,
          };
        });

        setLeaders(leaders);
        setStrategies(processedStrategies);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="discover">
      <h1 className="discover__title">Discover</h1>
      <div className="discover__search">
        <input
          type="search"
          className="discover__search-input"
          placeholder="AI powered search..."
        />
        <button className="discover__search-ai">
          <img src={AiGif} alt="AI Search" />
        </button>
      </div>
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      {activeTab === "Leaders" ? (
        loading ? (
          <>
            <h2 className="discover__section-title">Top 3 Leaders</h2>
            <div className="discover__top-leaders">
              {[...Array(3)].map((_, index) => (
                <SkeletonCard key={index} large showRank />
              ))}
            </div>

            <h2 className="discover__section-title">AI Suggested Leaders</h2>
            <div className="discover__leaders-grid">
              {[...Array(5)].map((_, index) => (
                <SkeletonCard key={`ai-${index}`} />
              ))}
            </div>

            <h2 className="discover__section-title">Top Earners</h2>
            <div className="discover__leaders-grid">
              {[...Array(5)].map((_, index) => (
                <SkeletonCard key={`earners-${index}`} />
              ))}
            </div>

            <h2 className="discover__section-title">Most Popular</h2>
            <div className="discover__leaders-grid">
              {[...Array(5)].map((_, index) => (
                <SkeletonCard key={`popular-${index}`} />
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="discover__section-title">Top 3 Leaders</h2>
            <div className="discover__top-leaders">
              {topLeaders.map((leader, index) => (
                <LeaderCard
                  key={leader.id}
                  leader={leader}
                  rank={index + 1}
                  onFollow={handleFollowToggle}
                  large
                />
              ))}
            </div>

            <h2 className="discover__section-title">AI Suggested Leaders</h2>
            <div className="discover__leaders-grid">
              {aiSuggestedLeaders.map((leader) => (
                <LeaderCard
                  key={leader.id}
                  leader={leader}
                  onFollow={handleFollowToggle}
                />
              ))}
            </div>

            <h2 className="discover__section-title">Top Earners</h2>
            <div className="discover__leaders-grid">
              {topEarners.map((leader) => (
                <LeaderCard
                  key={leader.id}
                  leader={leader}
                  onFollow={handleFollowToggle}
                />
              ))}
            </div>

            <h2 className="discover__section-title">Most Popular</h2>
            <div className="discover__leaders-grid">
              {mostPopular.map((leader) => (
                <LeaderCard
                  key={leader.id}
                  leader={leader}
                  onFollow={handleFollowToggle}
                />
              ))}
            </div>
          </>
        )
      ) : loading ? (
        <>
          <h2 className="discover__section-title">Top Strategies</h2>
          <div className="discover__top-leaders">
            {[...Array(3)].map((_, index) => (
              <SkeletonCard key={index} large showRank />
            ))}
          </div>

          <h2 className="discover__section-title">AI Suggested Strategies</h2>
          <div className="discover__leaders-grid">
            {[...Array(5)].map((_, index) => (
              <SkeletonCard key={`ai-${index}`} />
            ))}
          </div>

          <h2 className="discover__section-title">Popular Strategies</h2>
          <div className="discover__leaders-grid">
            {[...Array(5)].map((_, index) => (
              <SkeletonCard key={`popular-${index}`} />
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="discover__section-title">Top Strategies</h2>
          <div className="discover__top-leaders">
            {topStrategies.map((strategy, index) => (
              <StrategyCard
                key={strategy.id}
                strategy={strategy}
                rank={index + 1}
                onFollow={handleFollowToggle}
                onCopy={handleCopyStrategy}
                large
              />
            ))}
          </div>

          <h2 className="discover__section-title">AI Suggested Strategies</h2>
          <div className="discover__leaders-grid">
            {aiSuggestedStrategies.map((strategy) => (
              <StrategyCard
                key={strategy.id}
                strategy={strategy}
                onFollow={handleFollowToggle}
                onCopy={handleCopyStrategy}
              />
            ))}
          </div>

          <h2 className="discover__section-title">Popular Strategies</h2>
          <div className="discover__leaders-grid">
            {popularStrategies.map((strategy) => (
              <StrategyCard
                key={strategy.id}
                strategy={strategy}
                onFollow={handleFollowToggle}
                onCopy={handleCopyStrategy}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
