import { Post, User, TradingStrategy } from "../types";

const JSON_SERVER_URL = process.env.JSON_SERVER_URL || 'http://json-server:3001';

export class DataService {
    async getUser(userId: string): Promise<User | null> {
        try {
            const response = await fetch(`${JSON_SERVER_URL}/users/${userId}`);
            if (!response.ok) return null;
            const data = await response.json();
            return data as User;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    }

    async getUserPosts(): Promise<Post[]> {
        try {
            const response = await fetch(`${JSON_SERVER_URL}/posts`);
            if (!response.ok) return [];
            const data = await response.json();
            return data as Post[];
        } catch (error) {
            console.error('Error fetching posts:', error);
            return [];
        }
    }

    async getUserStrategies(userId: string): Promise<TradingStrategy[]> {
        try {
            const response = await fetch(`${JSON_SERVER_URL}/tradingStrategies`);
            if (!response.ok) return [];
            const strategies = await response.json() as TradingStrategy[];
            return strategies.filter(s => s.copiers.includes(userId));
        } catch (error) {
            console.error('Error fetching strategies:', error);
            return [];
        }
    }
}
