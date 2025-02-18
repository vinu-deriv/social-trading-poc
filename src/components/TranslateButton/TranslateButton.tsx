import { useState, useEffect } from 'react';
import Button from '../input/Button';
import { translateText } from '../../services/translationService';

interface TranslateButtonProps {
  text: string;
  onTranslation: (translatedText: string) => void;
}

const TranslateButton = ({ text, onTranslation }: TranslateButtonProps) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEnglish, setIsEnglish] = useState(true);
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [showingOriginal, setShowingOriginal] = useState(false);

  const handleTranslate = async () => {
    // If already translated, toggle between original and translated text
    if (isTranslated) {
      setShowingOriginal(!showingOriginal);
      onTranslation(showingOriginal ? translatedText || text : text);
      return;
    }

    // First-time translation
    setError(null);
    try {
      setIsTranslating(true);
      const translated = await translateText(text);
      setTranslatedText(translated);
      onTranslation(translated);
      setIsTranslated(true);
      setShowingOriginal(false);
    } catch (error) {
      console.error('Translation error:', error);
      setError(error instanceof Error ? error.message : 'Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  const getButtonText = () => {
    if (error) return 'Translation Failed';
    if (isTranslating) return '✦ Translating...';
    if (isTranslated) {
      return showingOriginal ? '✦ Show Translation' : '✦ Show Original';
    }
    return '✦ See translation';
  };

  // Check if text is English on mount and when text changes
  useEffect(() => {
    // Skip empty text or text that's not loaded yet
    if (!text?.trim()) {
      return;
    }

    // Skip text that's already in English (contains only basic Latin characters, numbers, and punctuation)
    const isAscii = /^[A-Za-z0-9\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/.test(text);
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
    <Button
      onClick={handleTranslate}
      disabled={!!error || isTranslating}
      variant="text"
      className="post-engagement__button"
    >
      {getButtonText()}
    </Button>
  );
};

export default TranslateButton;
