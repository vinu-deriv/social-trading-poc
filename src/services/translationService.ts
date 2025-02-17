const RAPIDAPI_KEY = "d692c38f6emsh2d2a89c4e5c9c87p1e2f98jsn6c0e9b5d4c7c"; // Free tier key

export const translateText = async (
  text: string,
  targetLang: string = "EN"
): Promise<string> => {
  try {
    const response = await fetch(
      "https://deep-translate1.p.rapidapi.com/language/translate/v2",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": "deep-translate1.p.rapidapi.com",
        },
        body: JSON.stringify({
          q: text,
          source: "auto",
          target: targetLang,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Translation failed");
    }

    const data = await response.json();
    const translatedText = data.data.translations.translatedText;

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
