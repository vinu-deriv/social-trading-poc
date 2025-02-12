import { useState } from "react";
import type { Comment } from "@/types/post.types";
import UserInfo from "../../user/UserInfo";
import Button from "../../input/Button";
import TextInput from "../../input/TextInput";
import "./CommentCard.css";

export interface CommentCardProps {
    comment: Comment;
    currentUserId: string;
    onLike?: () => void;
    onReply?: (content: string) => void;
    level?: number;
    showReplyInput?: boolean;
}

const CommentCard = ({
    comment,
    currentUserId,
    onLike,
    onReply,
    level = 0,
    showReplyInput = false,
}: CommentCardProps) => {
    const [isReplying, setIsReplying] = useState(showReplyInput);
    const [replyContent, setReplyContent] = useState("");
    const baseClass = "comment-card";
    const isLiked = comment.likes.includes(currentUserId);

    const handleSubmitReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (replyContent.trim() && onReply) {
            onReply(replyContent.trim());
            setReplyContent("");
            setIsReplying(false);
        }
    };

    return (
        <div
            className={`${baseClass} ${baseClass}--level-${level}`}
            data-testid="comment-card"
        >
            <div className={`${baseClass}__content`}>
                <UserInfo
                    username={comment.userId}
                    timestamp={comment.createdAt}
                    size="small"
                />
                <p className={`${baseClass}__text`}>{comment.content}</p>
                <div className={`${baseClass}__actions`}>
                    {onLike && (
                        <Button
                            variant="action"
                            isActive={isLiked}
                            onClick={onLike}
                            count={comment.likes.length}
                        >
                            {isLiked ? "Liked" : "Like"}
                        </Button>
                    )}
                    {onReply && (
                        <Button
                            variant="action"
                            onClick={() => setIsReplying(!isReplying)}
                        >
                            Reply
                        </Button>
                    )}
                </div>
                {isReplying && (
                    <form
                        className={`${baseClass}__reply-form`}
                        onSubmit={handleSubmitReply}
                    >
                        <TextInput
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write a reply..."
                            className={`${baseClass}__reply-input`}
                        />
                        <div className={`${baseClass}__reply-actions`}>
                            <Button
                                type="button"
                                variant="text"
                                onClick={() => setIsReplying(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={!replyContent.trim()}
                            >
                                Reply
                            </Button>
                        </div>
                    </form>
                )}
            </div>
            {comment.replies && comment.replies.length > 0 && (
                <div className={`${baseClass}__replies`}>
                    {comment.replies.map((reply) => (
                        <CommentCard
                            key={reply.id}
                            comment={reply}
                            currentUserId={currentUserId}
                            onLike={onLike}
                            onReply={onReply}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentCard;
