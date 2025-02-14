import { Post, User, TradingStrategy } from "../types";

const JSON_SERVER_URL = process.env.JSON_SERVER_URL;
if (!JSON_SERVER_URL) {
    throw new Error('JSON_SERVER_URL environment variable is not set');
}

export class DataService {
    async getUserPosts(): Promise<Post[]> {
        try {
            const response = await fetch(`${JSON_SERVER_URL}/posts`);
            if (!response.ok) throw new Error('Failed to fetch posts');
            const data = await response.json();
            return data as Post[];
        } catch (error) {
            console.error('Error fetching posts:', error);
            return [];
        }
    }

    async getPost(postId: string): Promise<Post | null> {
        try {
            const response = await fetch(`${JSON_SERVER_URL}/posts/${postId}`);
            if (!response.ok) throw new Error('Failed to fetch post');
            const data = await response.json();
            return data as Post;
        } catch (error) {
            console.error('Error fetching post:', error);
            return null;
        }
    }

    async getUserStrategies(userId: string): Promise<TradingStrategy[]> {
        try {
            const response = await fetch(`${JSON_SERVER_URL}/tradingStrategies?copiers_like=${userId}`);
            if (!response.ok) throw new Error('Failed to fetch strategies');
            const data = await response.json();
            return data as TradingStrategy[];
        } catch (error) {
            console.error('Error fetching strategies:', error);
            return [];
        }
    }

    async getUser(userId: string): Promise<User | null> {
        try {
            const response = await fetch(`${JSON_SERVER_URL}/users/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch user');
            const data = await response.json();
            return data as User;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    }
}
