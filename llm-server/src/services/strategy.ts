import Anthropic from '@anthropic-ai/sdk';
import { TradingStrategy } from '../types';
import { StrategyComparison } from '../types/comparison';

export class StrategyService {
  private anthropic: Anthropic;
  private readonly MODEL = 'claude-3-5-sonnet-20241022';

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is required');
    }
    this.anthropic = new Anthropic({ apiKey });
  }

  private sanitizeJsonText(text: string) {
    console.log(`[Strategy] Sanitizing JSON text (${text.length} chars)`);
    const result = text.replace(/[^\x20-\x7E]/g, '');
    console.log(`[Strategy] Sanitized JSON result (${result.length} chars)`);
    return result;
  }

  public async compareStrategies(strategies: TradingStrategy[]): Promise<StrategyComparison> {
    if (strategies.length < 2 || strategies.length > 4) {
      throw new Error('Must compare between 2 and 4 strategies');
    }

    const prompt = `Compare these trading strategies based on their existing fields:
      ${JSON.stringify(strategies, null, 2)}

      Return a JSON object comparing only the following aspects:
      {
        "overview": {
          "summary": "Brief comparison focusing on performance, risk, and trade type differences"
        },
        "comparisonMatrix": {
          "riskLevel": {"strategyName": "risk level from strategy"},
          "performance": {
            "strategyName": {
              "totalReturn": "number from strategy",
              "winRate": "number from strategy",
              "averageProfit": "number from strategy"
            }
          }
        },
        "recommendation": {
          "allocation": {
            "strategyName": "percentage number (e.g. 40 for 40%) - must add up to 100"
          }
        }
      }

      Use ONLY the data available in the strategies. Do not add any fields not present in the original data.
      For allocation percentages, consider each strategy's performance metrics and risk level to suggest an optimal portfolio distribution.
      
      Important:
      1. Include a clear summary in the overview section
      2. Use exact strategy names as keys in riskLevel and performance objects
      3. Ensure allocation percentages add up to 100%
      4. Base all comparisons on actual strategy data`;

    try {
      const response = await this.anthropic.messages.create({
        model: this.MODEL,
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      });

      let content = '';
      if (
        Array.isArray(response.content) &&
        response.content.length > 0 &&
        response.content[0].text
      ) {
        content = response.content[0].text;
      }

      const sanitizedContent = this.sanitizeJsonText(content);
      const jsonMatch = sanitizedContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('[Strategy] No JSON found in response:', sanitizedContent);
        throw new Error('Invalid response format - no JSON found');
      }

      try {
        const parsedData = JSON.parse(jsonMatch[0]);

        // Validate required fields
        if (!parsedData.overview?.summary) {
          throw new Error('Missing overview summary');
        }
        if (!parsedData.comparisonMatrix?.riskLevel) {
          throw new Error('Missing risk level comparison');
        }
        if (!parsedData.comparisonMatrix?.performance) {
          throw new Error('Missing performance comparison');
        }
        if (!parsedData.recommendation?.allocation) {
          throw new Error('Missing recommendation data');
        }

        // Validate allocation percentages sum to 100
        const totalAllocation = Object.values(parsedData.recommendation.allocation).reduce<number>(
          (sum, value) => sum + (typeof value === 'number' ? value : 0),
          0
        );
        if (Math.abs(totalAllocation - 100) > 0.1) {
          // Allow small floating point differences
          throw new Error('Allocation percentages must sum to 100%');
        }

        return parsedData as StrategyComparison;
      } catch (parseError) {
        console.error('[Strategy] Error parsing JSON:', parseError, '\nJSON string:', jsonMatch[0]);
        throw new Error(
          parseError instanceof Error ? parseError.message : 'Failed to parse response JSON'
        );
      }
    } catch (error) {
      console.error('[Strategy] Error comparing strategies:', error);
      throw error;
    }
  }
}

export const strategyService = new StrategyService();
