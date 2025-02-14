import { Post, User, TradingStrategy } from "../types";
import path from "path";
import fs from "fs";

const JSON_SERVER_URL = process.env.JSON_SERVER_URL;
if (!JSON_SERVER_URL) {
    throw new Error('JSON_SERVER_URL environment variable is not set');
}

interface Database {
    users: User[];
    posts: Post[];
    tradingStrategies: TradingStrategy[];
}

export class DataService {
    private data: Database;

    constructor() {
        // Go up two levels from src/services to reach root
        const dbPath = path.join(__dirname, "../../..", "db.json");
        this.data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    }

    async getUserPosts(): Promise<Post[]> {
        try {
            const response = await fetch(`${JSON_SERVER_URL}/posts`);
            if (!response.ok) return [];
            const data = await response.json();
            return data as Post[];
        } catch (error) {
            console.error('Error fetching posts:', error);
            // Fallback to local data if fetch fails
            return this.getLocalPosts();
        }
    }

    private getLocalPosts(): Post[] {
        return this.data.posts;
    }

    getPost(postId: string): Post | null {
        return this.data.posts.find((p: Post) => p.id === postId) || null;
    }

    getUserStrategies(userId: string): TradingStrategy[] {
        return this.data.tradingStrategies.filter((s: TradingStrategy) =>
            s.copiers.includes(userId)
        );
    }
}
