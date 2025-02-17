const LLM_SERVER_URL =
  import.meta.env.VITE_LLM_SERVER_URL || "http://localhost:3000";

export const translateText = async (
  text: string,
  targetLang: string = "EN"
): Promise<string> => {
  try {
    const response = await fetch(`${LLM_SERVER_URL}/api/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        targetLang,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Translation failed");
    }

    const data = await response.json();
    const translatedText = data.translatedText;

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
