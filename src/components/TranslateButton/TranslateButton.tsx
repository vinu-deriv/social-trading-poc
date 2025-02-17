import { useState, useEffect } from "react";
import AIButton from "../AIButton";
import { translateText } from "../../services/translationService";

interface TranslateButtonProps {
  text: string;
  onTranslation: (translatedText: string) => void;
}

const TranslateButton = ({ text, onTranslation }: TranslateButtonProps) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEnglish, setIsEnglish] = useState(true);

  const handleTranslate = async () => {
    setError(null);
    try {
      setIsTranslating(true);
      const translatedText = await translateText(text);
      onTranslation(translatedText);
    } catch (error) {
      console.error("Translation error:", error);
      setError(error instanceof Error ? error.message : "Translation failed");
    } finally {
      setIsTranslating(false);
    }
  };

  // Check if text is English on mount and when text changes
  useEffect(() => {
    const checkLanguage = async () => {
      try {
        const translatedText = await translateText(text);
        // If translation returns the same text, it's English
        setIsEnglish(translatedText === text);
      } catch (error) {
        console.error("Language check error:", error);
        // Hide button on error
        setIsEnglish(true);
      }
    };
    checkLanguage();
  }, [text]);

  if (isEnglish) {
    return null;
  }

  return (
    <AIButton
      onClick={handleTranslate}
      isLoading={isTranslating}
      loadingText="Translating..."
      disabled={!!error}
    >
      {error ? "Translation Failed" : "Translate"}
    </AIButton>
  );
};

export default TranslateButton;
