import React from 'react';
import { TradingPreferences } from '../../../../types/trading';
import { RangeField } from '../form/RangeField';
import { NumberField } from '../form/NumberField';
import { HelperBox } from '../form/HelperBox';

interface RiskStepProps {
  preferences: TradingPreferences;
  handlePreferenceChange: (
    field: keyof TradingPreferences,
    value: TradingPreferences[keyof TradingPreferences]
  ) => void;
  onNext: () => void;
  buttonText?: string;
}

export const RiskStep: React.FC<RiskStepProps> = ({
  preferences,
  handlePreferenceChange,
  onNext,
  buttonText = 'Get Started',
}) => {
  const isStakeError = preferences.minStake > preferences.maxStake;

  return (
    <div className="step-content risk-step">
      <form className="preferences-form" onSubmit={e => e.preventDefault()}>
        <RangeField
          label="Maximum Drawdown (%)"
          helperText="Maximum loss you're willing to accept"
          value={preferences.maxDrawdown}
          min={5}
          max={50}
          step={5}
          onChange={value => handlePreferenceChange('maxDrawdown', value)}
        />

        <RangeField
          label="Target Annual Return (%)"
          helperText="Your desired yearly return on investment"
          value={preferences.targetReturn}
          min={5}
          max={100}
          step={5}
          onChange={value => handlePreferenceChange('targetReturn', value)}
        />

        <NumberField
          label="Minimum Stake ($)"
          helperText="Minimum amount to invest per trade"
          value={preferences.minStake}
          min={1}
          onChange={value => handlePreferenceChange('minStake', value)}
          error={isStakeError ? 'Minimum stake cannot be greater than maximum stake' : undefined}
          className="stake-input"
        />

        <NumberField
          label="Maximum Stake ($)"
          helperText="Maximum amount to invest per trade"
          value={preferences.maxStake}
          min={preferences.minStake}
          onChange={value => handlePreferenceChange('maxStake', value)}
          error={isStakeError ? 'Maximum stake cannot be less than minimum stake' : undefined}
          className="stake-input"
        />

        <HelperBox>
          <p>
            These settings help us ensure your trading activity aligns with your risk tolerance and
            investment goals.
          </p>
        </HelperBox>

        <button type="button" className="next-step-button" onClick={onNext} disabled={isStakeError}>
          {buttonText}
        </button>
      </form>
    </div>
  );
};
