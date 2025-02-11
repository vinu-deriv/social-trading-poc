import type Post from "@/types/post.types";
import "./PostContent.css";

interface PostContentProps {
    content: Post["content"];
}

const PostContent = ({ content }: PostContentProps) => {
    const { text, images = [] } = content;
    const hasImages = images.length > 0;
    const isSingleImage = images.length === 1;

    return (
        <div className="post-content">
            {text && <p className="post-content__text">{text}</p>}

            {hasImages && (
                <div
                    className={`post-content__images ${
                        isSingleImage
                            ? "post-content__images--single"
                            : "post-content__images--multiple"
                    }`}
                >
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Post image ${index + 1}`}
                            className={`post-content__image ${
                                isSingleImage && "post-content__image--single"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostContent;
