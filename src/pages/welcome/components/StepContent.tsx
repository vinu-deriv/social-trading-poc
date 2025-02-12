import {
  TradingPreferences,
  WelcomeStep,
  WELCOME_STEPS,
} from "../../../types/trading";
import { WelcomeStep as WelcomeStepComponent } from "./steps/WelcomeStep";
import { PreferencesStep } from "./steps/PreferencesStep";
import { RiskStep } from "./steps/RiskStep";

interface StepContentProps {
  currentStep: WelcomeStep;
  preferences: TradingPreferences;
  handlePreferenceChange: (
    field: keyof TradingPreferences,
    value: TradingPreferences[keyof TradingPreferences]
  ) => void;
  onNext: () => void;
}

const StepContent = ({
  currentStep,
  preferences,
  handlePreferenceChange,
  onNext,
}: StepContentProps) => {
  switch (currentStep) {
    case WELCOME_STEPS.WELCOME:
      return <WelcomeStepComponent onNext={onNext} />;

    case WELCOME_STEPS.PREFERENCES:
      return (
        <PreferencesStep
          preferences={preferences}
          handlePreferenceChange={handlePreferenceChange}
          onNext={onNext}
        />
      );

    case WELCOME_STEPS.RISK:
      return (
        <RiskStep
          preferences={preferences}
          handlePreferenceChange={handlePreferenceChange}
          onNext={onNext}
        />
      );

    default:
      return null;
  }
};

export default StepContent;
