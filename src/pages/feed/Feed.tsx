import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import TabNavigation from "@/components/navigation/TabNavigation/TabNavigation";
import FeedList from "@/modules/feed/components/FeedList/FeedList";
import Loader from "@/components/layout/Loader";
import "./Feed.css";

const Feed = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("For you");

  if (authLoading || !user) {
    return (
      <div className="feed-page__container">
        <div className="feed-page__loading">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="feed-page">
      <TabNavigation
        tabs={["For you", "Following"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="feed-page__container">
        <main>
          <FeedList activeTab={activeTab} currentUserId={user.id} />
        </main>
      </div>
    </div>
  );
};

export default Feed;
