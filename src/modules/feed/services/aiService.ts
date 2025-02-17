import { AIInsight } from "@/types/ai.types";

const API_URL = import.meta.env.VITE_LLM_SERVER_URL;
if (!API_URL) {
    throw new Error('VITE_LLM_SERVER_URL environment variable is not set');
}

interface SingleInsightResponse {
    insight: AIInsight;
}

export const getPostInsight = async (
    userId: string,
    postId: string
): Promise<AIInsight | null> => {
    if (!userId || !postId) {
        console.warn('Invalid parameters: userId and postId are required');
        return null;
    }

    try {
        const response = await fetch(
            `${API_URL}/api/ai/post-insight/${userId}/${postId}`
        );
        if (!response.ok) {
            console.warn(`AI insight service error: ${response.status}`);
            return null;
        }
        const data: SingleInsightResponse = await response.json();

        // Validate insight
        if (!data.insight || !data.insight.sentiment) {
            console.warn("Invalid insight response:", data);
            return null;
        }

        return data.insight;
    } catch (error) {
        console.error("AI insight service error:", error);
        return null;
    }
};
