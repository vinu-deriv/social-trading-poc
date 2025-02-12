import Avatar from "../../components/user/Avatar";
import Button from "../../components/input/Button";
import "./Discover.css";

// Mock data for top leaders
const topLeaders = [
  {
    id: 1,
    username: "Sarah Johnson",
    avatar: undefined,
    copiers: 1245,
    totalProfit: 125000,
    isFollowing: false,
  },
  {
    id: 2,
    username: "Michael Chen",
    avatar: undefined,
    copiers: 892,
    totalProfit: 98500,
    isFollowing: true,
  },
  {
    id: 3,
    username: "Emma Davis",
    avatar: undefined,
    copiers: 756,
    totalProfit: 87600,
    isFollowing: false,
  },
  {
    id: 4,
    username: "Alex Turner",
    avatar: undefined,
    copiers: 654,
    totalProfit: 76400,
    isFollowing: false,
  },
  {
    id: 5,
    username: "David Kim",
    avatar: undefined,
    copiers: 543,
    totalProfit: 65300,
    isFollowing: true,
  },
  {
    id: 6,
    username: "Lisa Wang",
    avatar: undefined,
    copiers: 432,
    totalProfit: 54200,
    isFollowing: false,
  },
  {
    id: 7,
    username: "James Wilson",
    avatar: undefined,
    copiers: 321,
    totalProfit: 43100,
    isFollowing: false,
  },
  {
    id: 8,
    username: "Maria Garcia",
    avatar: undefined,
    copiers: 210,
    totalProfit: 32000,
    isFollowing: false,
  },
  {
    id: 9,
    username: "John Smith",
    avatar: undefined,
    copiers: 198,
    totalProfit: 21900,
    isFollowing: false,
  },
  {
    id: 10,
    username: "Sophie Brown",
    avatar: undefined,
    copiers: 187,
    totalProfit: 19800,
    isFollowing: false,
  },
];

export default function Discover() {
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
          placeholder="Search leaders, strategies, or markets..."
        />
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
