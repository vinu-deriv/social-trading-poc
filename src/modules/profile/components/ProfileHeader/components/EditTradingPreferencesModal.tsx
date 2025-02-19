import React from 'react';
import type { TradingPreferences } from '@/types/trading';
import { PreferencesStep } from '@/pages/welcome/components/steps/PreferencesStep';
import { RiskStep } from '@/pages/welcome/components/steps/RiskStep';
import Modal from '@/components/modal/Modal';
import { useAuth } from '@/context/AuthContext';

interface EditTradingPreferencesModalProps {
  preferences: TradingPreferences;
  onSave: (preferences: TradingPreferences) => void;
  onClose: () => void;
}

const EditTradingPreferencesModal: React.FC<EditTradingPreferencesModalProps> = ({
  preferences,
  onSave,
  onClose,
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = React.useState<'preferences' | 'risk'>('preferences');
  const [updatedPreferences, setUpdatedPreferences] = React.useState(preferences);

  const handlePreferenceChange = (
    field: keyof TradingPreferences,
    value: TradingPreferences[keyof TradingPreferences]
  ) => {
    setUpdatedPreferences(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSavePreferences = async () => {
    try {
      // Save preferences to backend
      await fetch(`${import.meta.env.VITE_JSON_SERVER_URL}/users/${user?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tradingPreferences: updatedPreferences,
        }),
      });

      // Update local storage
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        parsed.user.tradingPreferences = updatedPreferences;
        localStorage.setItem('auth', JSON.stringify(parsed));
      }

      // Call the onSave callback
      onSave(updatedPreferences);
    } catch (error) {
      console.error('Error updating trading preferences:', error);
    }
  };

  const handleNext = async () => {
    if (currentStep === 'preferences') {
      setCurrentStep('risk');
    } else {
      await handleSavePreferences();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Edit ${currentStep === 'preferences' ? 'Trading Preferences' : 'Risk Settings'}`}
    >
      {currentStep === 'preferences' ? (
        <PreferencesStep
          preferences={updatedPreferences}
          handlePreferenceChange={handlePreferenceChange}
          onNext={handleNext}
        />
      ) : (
        <RiskStep
          preferences={updatedPreferences}
          handlePreferenceChange={handlePreferenceChange}
          onNext={handleNext}
          buttonText="Save"
        />
      )}
    </Modal>
  );
};

export default EditTradingPreferencesModal;
