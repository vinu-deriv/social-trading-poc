import Button from "@/components/input/Button";
import Badge from "@/components/feedback/Badge";
import type { Comment } from "@/types/post.types";
import { PostSentiment, getSentimentDetails } from "./config";
import "./PostAIInsights.css";

interface PostAIInsightsProps {
    postId: string;
    content: {
        text: string;
        images?: string[];
    };
    comments: Comment[];
    userType: "leader" | "copier";
    onCopyTrader?: () => void;
}

const PostAIInsights = ({
    postId, // Will be used for AI analysis caching
    content, // Will be used for content analysis
    comments, // Will be used for sentiment analysis
    userType,
    onCopyTrader,
}: PostAIInsightsProps) => {
    // Placeholder values - these would come from AI service
    const isLegitimate = content.text.length > 0; // Simple validation for now
    const summary = `Analysis of post ${postId}: ${content.text.substring(
        0,
        100
    )}...`;
    // This would be determined by AI service in production
    const sentiment: PostSentiment =
        comments.length > 0 ? "consistent" : "analysis";
    const sentimentDetails = getSentimentDetails(sentiment);

    return (
        <div className="post-ai-insights">
            {/* Header */}
            <h4 className="post-ai-insights__title">✦ AI Insights</h4>

            {/* Summary */}
            <p className="post-ai-insights__summary">{summary}</p>

            {/* Badges Row */}
            <div className="post-ai-insights__badges">
                <Badge
                    variant={isLegitimate ? "success" : "warning"}
                    icon={isLegitimate ? "✓" : "⚠️"}
                >
                    {isLegitimate ? "Verified" : "Needs Verification"}
                </Badge>
                <Badge
                    variant={sentimentDetails.variant}
                    icon={sentimentDetails.icon}
                >
                    {sentimentDetails.text}
                </Badge>
            </div>

            {/* Quick Actions */}
            <div className="post-ai-insights__actions">
                <h4 className="post-ai-insights__actions-title">
                    Quick Actions
                </h4>
                <div className="post-ai-insights__actions-grid">
                    {userType === "copier" ? (
                        <Button
                            variant="primary"
                            onClick={onCopyTrader}
                            rounded
                        >
                            Copy Trader
                        </Button>
                    ) : (
                        <Button variant="primary" rounded>
                            Trade Now
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostAIInsights;
