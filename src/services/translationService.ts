const API_URL = "http://localhost:3002/api";

export const translateText = async (
  text: string,
  targetLang: string = "EN"
): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/translate`, {
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
