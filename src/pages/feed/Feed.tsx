import FeedList from "@modules/feed/components/FeedList";
import "./Feed.css";

const Feed = () => {
    // TODO: Get current user ID from auth context
    const currentUserId = "copier1"; // Temporary hardcoded user

    return (
        <div className="feed-page">
            <div className="feed-page__container">
                <header className="feed-page__header">
                    <h1 className="feed-page__title">Social Trading Feed</h1>
                </header>
                <main>
                    <FeedList currentUserId={currentUserId} />
                </main>
            </div>
        </div>
    );
};

export default Feed;
