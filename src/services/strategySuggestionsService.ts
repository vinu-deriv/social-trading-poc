import type { ExtendedStrategy } from '@/types/strategy.types';

const LLM_SERVER_URL = import.meta.env.VITE_LLM_SERVER_URL;
if (!LLM_SERVER_URL) {
  throw new Error('VITE_LLM_SERVER_URL environment variable is not set');
}

export const strategySuggestionsService = {
  async getSuggestedStrategies(userId?: string): Promise<ExtendedStrategy[]> {
    try {
      const response = await fetch(
        `${LLM_SERVER_URL}/api/strategy-suggestions${userId ? `?userId=${userId}` : ''}`
      );
      if (!response.ok) throw new Error('Failed to fetch strategy suggestions');
      const { suggestions } = await response.json();
      return suggestions;
    } catch (error) {
      console.error('Error getting strategy suggestions:', error);
      return [];
    }
  },
};
