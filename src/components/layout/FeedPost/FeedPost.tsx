import { useState } from "react";
import type Post from "@/types/post.types";
import type User from "@/types/user.types";
import UserInfo from "../../user/UserInfo";
import Button from "../../input/Button";
import CommentCard from "../CommentCard";
import TextInput from "../../input/TextInput";
import "./FeedPost.css";

export interface FeedPostProps {
    post: Post;
    user: User;
    currentUserId: string;
    onLike?: () => void;
    onComment?: (content: string) => void;
    onShare?: () => void;
    onLikeComment?: (commentId: string) => void;
    onReplyToComment?: (commentId: string, content: string) => void;
}

const FeedPost = ({
    post,
    user,
    currentUserId,
    onLike,
    onComment,
    onShare,
    onLikeComment,
    onReplyToComment,
}: FeedPostProps) => {
    const [showComments, setShowComments] = useState(false);
    const [commentContent, setCommentContent] = useState("");
    const baseClass = "feed-post";
    const isLiked = post.engagement.likes.includes(currentUserId);

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentContent.trim() && onComment) {
            onComment(commentContent.trim());
            setCommentContent("");
        }
    };

    return (
        <article className={baseClass}>
            <div className={`${baseClass}__header`}>
                <UserInfo
                    username={user.username}
                    avatarUrl={user.profilePicture}
                    timestamp={post.createdAt}
                />
            </div>

            <div className={`${baseClass}__content`}>
                <p className={`${baseClass}__text`}>{post.content.text}</p>
                {post.content.images && post.content.images.length > 0 && (
                    <div className={`${baseClass}__images`}>
                        {/* TODO: Add ImageCarousel component */}
                        {post.content.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Post image ${index + 1}`}
                                className={`${baseClass}__image`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className={`${baseClass}__engagement`}>
                <div className={`${baseClass}__stats`}>
                    <span>{post.engagement.likes.length} likes</span>
                    <span>{post.engagement.comments.length} comments</span>
                    <span>{post.engagement.shares} shares</span>
                </div>

                <div className={`${baseClass}__actions`}>
                    {onLike && (
                        <Button
                            variant="action"
                            isActive={isLiked}
                            onClick={onLike}
                            count={post.engagement.likes.length}
                        >
                            {isLiked ? "Liked" : "Like"}
                        </Button>
                    )}
                    <Button
                        variant="action"
                        onClick={() => setShowComments(!showComments)}
                        count={post.engagement.comments.length}
                    >
                        Comment
                    </Button>
                    {onShare && (
                        <Button
                            variant="action"
                            onClick={onShare}
                            count={post.engagement.shares}
                        >
                            Share
                        </Button>
                    )}
                </div>
            </div>

            {showComments && (
                <div className={`${baseClass}__comments`}>
                    <form
                        className={`${baseClass}__comment-form`}
                        onSubmit={handleSubmitComment}
                    >
                        <TextInput
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            placeholder="Write a comment..."
                            className={`${baseClass}__comment-input`}
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={!commentContent.trim()}
                        >
                            Post
                        </Button>
                    </form>

                    <div className={`${baseClass}__comments-list`}>
                        {post.engagement.comments.map((comment) => (
                            <CommentCard
                                key={comment.id}
                                comment={comment}
                                currentUserId={currentUserId}
                                onLike={
                                    onLikeComment
                                        ? () => onLikeComment(comment.id)
                                        : undefined
                                }
                                onReply={
                                    onReplyToComment
                                        ? (content) =>
                                              onReplyToComment(
                                                  comment.id,
                                                  content
                                              )
                                        : undefined
                                }
                            />
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
};

export default FeedPost;
