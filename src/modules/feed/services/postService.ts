interface CreatePostContent {
    text: string;
    images: string[];
}

interface CreatePostData {
    userId: string;
    content: CreatePostContent;
}

export const createPost = async (data: CreatePostData) => {
    const response = await fetch("http://localhost:3001/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId: data.userId,
            content: {
                text: data.content.text,
                images: data.content.images,
            },
            engagement: {
                likes: [],
                comments: [],
                shares: 0,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to create post");
    }

    return response.json();
};
