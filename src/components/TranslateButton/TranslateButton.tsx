import { useState } from "react";
import AIButton from "../AIButton";
import { translateText } from "../../services/translationService";

interface TranslateButtonProps {
  text: string;
  onTranslation: (translatedText: string) => void;
}

const TranslateButton = ({ text, onTranslation }: TranslateButtonProps) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    setError(null);
    try {
      setIsTranslating(true);
      const translatedText = await translateText(text);
      // Only update if the translation is different from the original text
      if (translatedText.toLowerCase() !== text.toLowerCase()) {
        onTranslation(translatedText);
      }
    } catch (error) {
      console.error("Translation error:", error);
      setError(error instanceof Error ? error.message : "Translation failed");
    } finally {
      setIsTranslating(false);
    }
  };

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
