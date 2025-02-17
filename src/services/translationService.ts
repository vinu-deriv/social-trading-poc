const API_URL = import.meta.env.VITE_LLM_SERVER_URL;
if (!API_URL) {
  throw new Error("VITE_LLM_SERVER_URL environment variable is not set");
}

export const translateText = async (
  text: string,
  targetLang: string = "EN"
): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/api/translate`, {
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
      throw new Error("Translation failed");
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
