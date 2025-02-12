import { useEffect, useState } from "react";
import Avatar from "../../components/user/Avatar";
import Button from "../../components/input/Button";
import AiGif from "../../assets/icons/ai.gif";
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

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await fetch("http://localhost:3001/users");
        const users: User[] = await res.json();
        console.log(users);

        // Get leaders with random stats
        const leaders = users
          .filter((user) => user.userType === "leader")
          .map((leader) => ({
            id: leader.id,
            username: leader.username,
            avatar: leader.profilePicture,
            copiers: Math.floor(Math.random() * 2000) + 500, // Random copiers between 500-2500
            totalProfit: Math.floor(Math.random() * 900000) + 100000, // Random profit between 100k-1M
            winRate: Math.floor(Math.random() * 20) + 70, // Random win rate between 70-90%
            isFollowing: false,
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

  console.log("first", topLeaders);
  if (loading) {
    return <div className="discover">Loading...</div>;
  }

  return (
    <div className="discover">
      <h1 className="discover__title">Top Leaders</h1>
      <div className="discover__search">
        <input
          type="search"
          className="discover__search-input"
          placeholder="Search leaders, strategies, or markets..."
        />
        <button className="discover__search-ai">
          <img src={AiGif} alt="AI Search" />
        </button>
      </div>
      <div className="discover__leaders">
        {topLeaders.map((leader) => (
          <div key={leader.id} className="leader-card">
            <div className="leader-card__avatar">
              <Avatar
                size="large"
                username={leader.username}
                src={leader.avatar}
              />
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
                  <span className="leader-card__stat-label">Total Profit</span>
                  <span className="leader-card__stat-value leader-card__stat-value--profit">
                    {formatProfit(leader.totalProfit)}
                  </span>
                </div>
              </div>
              <Button
                variant={leader.isFollowing ? "secondary" : "primary"}
                className="leader-card__follow-btn"
              >
                {leader.isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
