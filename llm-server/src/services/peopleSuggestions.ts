import { DataService } from './data';
import { LLMService } from './llm';
import type { User } from '../types';

const dataService = new DataService();
const llmService = new LLMService();

// Helper function to sanitize JSON text
function sanitizeJsonText(text: string): string {
  return text.replace(/[^\x20-\x7E]/g, '');
}

interface ExtendedUser extends User {
  matchScore: number;
  matchReason: string;
}

interface PeopleSuggestionsResponse {
  suggestions: ExtendedUser[];
  totalResults: number;
}

export async function getPeopleSuggestions(userId: string): Promise<PeopleSuggestionsResponse> {
  try {
    // Get all users
    const users = await dataService.getUsers();

    // Filter out the requesting user
    const otherUsers = users.filter((user: User) => user.id !== userId);

    // Get the requesting user's data
    const currentUser = await dataService.getUser(userId);
    if (!currentUser) {
      throw new Error('User not found');
    }

    // Use LLM to get personalized suggestions
    const prompt = `Return ONLY a JSON array of the top 5 most compatible users in this exact format, with no additional text:
[
  {
    "userId": "string",
    "matchScore": number (0-100),
    "reason": "string (brief explanation of compatibility)"
  }
]

Context for analysis:
Current User Preferences:
- Trading Preferences: ${JSON.stringify(currentUser.tradingPreferences) || 'Not specified'}
- Performance: ${JSON.stringify(currentUser.performance) || 'Not specified'}

Available Users to Match:
${JSON.stringify(otherUsers, null, 2)}

Instructions:
1. Analyze each user's compatibility with the current user
2. Return the top 5 most compatible matches
3. Provide ONLY the JSON array with no other text
4. Ensure each user has all required fields (userId, matchScore, reason)
5. Match scores should be between 0-100`;

    const llmResponse = await llmService.generateChatResponse(prompt);
    const sanitizedResponse = sanitizeJsonText(llmResponse);
    const jsonMatch = sanitizedResponse.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      throw new Error('Invalid response format from LLM service');
    }

    let suggestedUsers;
    try {
      suggestedUsers = JSON.parse(jsonMatch[0]).slice(0, 5);

      // Validate the structure of each suggestion
      const validSuggestions = suggestedUsers.every(
        (s: any) =>
          s.userId &&
          typeof s.matchScore === 'number' &&
          s.matchScore >= 0 &&
          s.matchScore <= 100 &&
          typeof s.reason === 'string'
      );

      if (!validSuggestions) {
        throw new Error('Invalid suggestion format in LLM response');
      }
    } catch (error) {
      throw new Error('Failed to parse LLM response');
    }

    // Map LLM suggestions to user data
    const suggestions = suggestedUsers
      .map((suggestion: any) => {
        const user = otherUsers.find(u => u.id === suggestion.userId);
        if (!user) return null;

        return {
          ...user,
          matchScore: suggestion.matchScore,
          matchReason: suggestion.reason,
          isFollowing: currentUser.following?.includes(user.id) || false,
          totalProfit: user.performance?.totalPnL || 0,
          winRate: user.performance?.winRate || 0,
          copiers: user.followers?.length || 0,
        };
      })
      .filter(Boolean);

    return {
      suggestions,
      totalResults: suggestions.length,
    };
  } catch (error) {
    throw error;
  }
}
