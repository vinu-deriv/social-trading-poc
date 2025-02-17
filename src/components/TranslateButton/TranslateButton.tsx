import { useState, useEffect } from 'react';
import AIButton from '../AIButton';
import { translateText } from '../../services/translationService';

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
      console.error('Translation error:', error);
      setError(error instanceof Error ? error.message : 'Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  // Check if text is English on mount and when text changes
  useEffect(() => {
    // Skip empty text or text that's not loaded yet
    if (!text?.trim()) {
      return;
    }

    // Skip text that's already in English (contains only ASCII characters and emojis)
    const isAscii = /^[\x00-\x7F\u{1F300}-\u{1F9FF}]*$/u.test(text);
    if (isAscii) {
      setIsEnglish(true);
      return;
    }

    const checkLanguage = async () => {
      try {
        const translatedText = await translateText(text);
        // If translation returns the same text, it's English
        setIsEnglish(translatedText === text);
      } catch {
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
      {error ? 'Translation Failed' : 'Translate'}
    </AIButton>
  );
};

export default TranslateButton;
