import { DataService } from './data';
import { LLMService } from './llm';
import type { TradingStrategy, User } from '../types';

const dataService = new DataService();
const llmService = new LLMService();

// Helper function to sanitize JSON text
function sanitizeJsonText(text: string): string {
  return text.replace(/[^\x20-\x7E]/g, '');
}

interface ExtendedStrategy extends TradingStrategy {
  matchScore: number;
  matchReason: string;
}

interface StrategySuggestionsResponse {
  suggestions: ExtendedStrategy[];
  totalResults: number;
}

export async function getStrategySuggestions(
  userId?: string
): Promise<StrategySuggestionsResponse> {
  try {
    // Get data and filter out invalid strategies in parallel
    const [strategies, userData] = await Promise.all([
      dataService.getStrategies(),
      userId ? dataService.getUser(userId) : null,
    ]);

    // Use LLM to get personalized suggestions
    const prompt = `Return ONLY a JSON array of the top 5 most suitable strategies in this exact format, with no additional text:
[
  {
    "strategyId": "string",
    "matchScore": number (0-100),
    "reason": "string (brief explanation of suitability)"
  }
]

Context for analysis:
Current User Preferences:
- Trading Preferences: ${userData ? JSON.stringify(userData.tradingPreferences) : 'Not specified'}
- Performance: ${userData ? JSON.stringify(userData.performance) : 'Not specified'}

Available Strategies:
${JSON.stringify(
  strategies.map(s => ({
    id: s.id,
    name: s.name,
    description: s.description,
    tradeType: s.tradeType,
    riskLevel: s.riskLevel,
    performance: s.performance,
    copiers: s.copiers.length,
  })),
  null,
  2
)}

Instructions:
1. Analyze each strategy's suitability for the current user
2. Return the top 5 most suitable matches
3. Provide ONLY the JSON array with no other text
4. Ensure each strategy has all required fields (strategyId, matchScore, reason)
5. Match scores should be between 0-100
6. Consider:
   - Risk tolerance match
   - Trading style compatibility
   - Historical performance
   - Strategy popularity
   - Market conditions`;

    const llmResponse = await llmService.generateChatResponse(prompt);
    const sanitizedResponse = sanitizeJsonText(llmResponse);
    const jsonMatch = sanitizedResponse.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      throw new Error('Invalid response format from LLM service');
    }

    let suggestedStrategies;
    try {
      suggestedStrategies = JSON.parse(jsonMatch[0]).slice(0, 5);

      // Validate the structure of each suggestion
      const validSuggestions = suggestedStrategies.every(
        (s: any) =>
          s.strategyId &&
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

    // Map LLM suggestions to strategy data
    const suggestions = suggestedStrategies
      .map((suggestion: any) => {
        const strategy = strategies.find(s => s.id === suggestion.strategyId);
        if (!strategy) return null;

        return {
          ...strategy,
          matchScore: suggestion.matchScore,
          matchReason: suggestion.reason,
          isCopying: userData?.copiedStrategies?.includes(strategy.id) || false,
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
