interface AnthropicResponse {
  content: Array<{
    text: string;
  }>;
}

export const translateText = async (
  text: string,
  targetLang: string = "EN"
): Promise<string> => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY as string,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `Translate the following text to ${targetLang}. Only respond with the translated text, nothing else: ${text}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Translation failed");
    }

    const data = (await response.json()) as AnthropicResponse;
    if (!data?.content?.[0]?.text) {
      throw new Error("Invalid response format");
    }

    const translatedText = data.content[0].text.trim();

    // Only return translated text if it's different from the original
    if (translatedText.toLowerCase() !== text.toLowerCase()) {
      return translatedText;
    }
    return text;
  } catch (error) {
    console.error("Error translating text:", error);
    throw error;
  }
};
