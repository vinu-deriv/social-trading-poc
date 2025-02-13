import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import AiGif from "../../assets/icons/ai.gif";
import Tick from "../../assets/icons/Tick";
import Plus from "../../assets/icons/Plus";
import SkeletonCard from "../../components/layout/SkeletonCard";
import "./Discover.css";

type Leader = {
  id: string;
  username: string;
  avatar?: string;
  copiers: number;
  totalProfit: number;
  winRate: number;
  isFollowing: boolean;
};

type User = {
  id: string;
  username: string;
  profilePicture?: string;
  userType: string;
};

export default function Discover() {
  const [topLeaders, setTopLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

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

        // Update local state
        setTopLeaders((prevLeaders) =>
          prevLeaders.map((leader) =>
            leader.id === leaderId
              ? { ...leader, isFollowing: !leader.isFollowing }
              : leader
          )
        );
      } catch (error) {
        console.error("Error updating follow status:", error);
      }
    },
    [user]
  );

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await fetch("http://localhost:3001/users");
        const users: User[] = await res.json();
        console.log(users);

        // Get leaders with random stats
        // Get current user data to check following status
        const currentUserRes = user
          ? await fetch(`http://localhost:3001/users/${user.id}`)
          : null;
        const currentUserData = currentUserRes
          ? await currentUserRes.json()
          : null;

        const leaders = users
          .filter((u) => u.userType === "leader")
          .map((leader) => ({
            id: leader.id,
            username: leader.username,
            avatar: leader.profilePicture,
            copiers: Math.floor(Math.random() * 2000) + 500, // Random copiers between 500-2500
            totalProfit: Math.floor(Math.random() * 900000) + 100000, // Random profit between 100k-1M
            winRate: Math.floor(Math.random() * 20) + 70, // Random win rate between 70-90%
            isFollowing: currentUserData
              ? currentUserData.following.includes(leader.id)
              : false,
          }))
          .sort((a, b) => b.totalProfit - a.totalProfit);

        setTopLeaders(leaders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaders:", error);
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  const formatProfit = (profit: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(profit);
  };

  const formatCopiers = (count: number) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
    }).format(count);
  };

  return (
    <div className="discover">
      <h1 className="discover__title">Top Leaders</h1>
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
      <div className="discover__leaders">
        {loading
          ? [...Array(12)].map((_, index) => <SkeletonCard key={index} />)
          : topLeaders.map((leader) => (
              <div key={leader.id} className="leader-card">
                <div className="leader-card__banner">
                  <div className="leader-card__avatar">
                    <div className="leader-card__avatar-wrapper">
                      {leader.avatar ? (
                        <img
                          src={leader.avatar}
                          alt={leader.username}
                          className="leader-card__avatar-img"
                        />
                      ) : (
                        <div className="leader-card__avatar-placeholder">
                          {leader.username.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <button
                        className="leader-card__follow-icon"
                        onClick={() => handleFollowToggle(leader.id)}
                      >
                        {leader.isFollowing ? <Tick /> : <Plus />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="leader-card__info">
                  <h3 className="leader-card__name">{leader.username}</h3>
                  <div className="leader-card__stats">
                    <div className="leader-card__stat">
                      <span className="leader-card__stat-label">Copiers</span>
                      <span className="leader-card__stat-value">
                        {formatCopiers(leader.copiers)}
                      </span>
                    </div>
                    <div className="leader-card__stat">
                      <span className="leader-card__stat-label">
                        Total Profit
                      </span>
                      <span className="leader-card__stat-value leader-card__stat-value--profit">
                        {formatProfit(leader.totalProfit)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
