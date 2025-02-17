interface AnthropicResponse {
  content: Array<{
    text: string;
  }>;
}

// Simple in-memory cache for translations
const translationCache = new Map<string, { text: string; timestamp: number }>();
const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

const makeAnthropicRequest = async (
  prompt: string,
  model: string = "claude-3-sonnet-20240229"
): Promise<string> => {
  const maxRetries = 2;
  let lastError: Error | null = null;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY as string,
          "anthropic-version": "2024-01-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 1024,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = (await response.json()) as AnthropicResponse;
      if (!data?.content?.[0]?.text) {
        throw new Error("Invalid response format");
      }

      return data.content[0].text.trim();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
        continue;
      }
      throw lastError;
    }
  }
  throw new Error("Failed after retries");
};

export const translateText = async (
  text: string,
  targetLang: string = "EN"
): Promise<string> => {
  const cacheKey = `${text}:${targetLang}`;
  const cached = translationCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
    return cached.text;
  }

  try {
    // First detect the language
    const detectPrompt = `Detect the language of this text and respond with ONLY the ISO 639-1 language code in uppercase (e.g. 'EN' for English, 'ES' for Spanish, etc.). Text: "${text}"`;
    const detectedLang = await makeAnthropicRequest(
      detectPrompt,
      "claude-3-haiku-20240307"
    );

    // If it's already English, return the original text
    if (detectedLang === "EN") {
      return text;
    }

    // If not English, translate it
    const translatePrompt = `Translate this text to English. Only respond with the translated text: "${text}"`;

    const result = await makeAnthropicRequest(
      translatePrompt,
      "claude-3-sonnet-20240229"
    );

    // Cache the result
    translationCache.set(cacheKey, {
      text: result,
      timestamp: Date.now(),
    });

    return result;
  } catch (error) {
    console.error("Error translating text:", error);
    throw error;
  }
};
