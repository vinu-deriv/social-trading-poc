import React from 'react';
import '../form/form.css';
import { TradingPreferences, MARKET_OPTIONS, TRADE_TYPE_OPTIONS } from '../../../../types/trading';
import { SelectField } from '../form/SelectField';
import { CheckboxGridField } from '../form/CheckboxGridField';
import {
  RISK_TOLERANCE_OPTIONS,
  INVESTMENT_STYLE_OPTIONS,
  TRADING_FREQUENCY_OPTIONS,
} from '../form/config';
import { Option } from '../form/SelectField';

type TRiskTolerance = TradingPreferences[keyof TradingPreferences];

interface PreferencesStepProps {
  preferences: TradingPreferences;
  handlePreferenceChange: (field: keyof TradingPreferences, value: TRiskTolerance) => void;
  onNext: () => void;
}

export const PreferencesStep: React.FC<PreferencesStepProps> = ({
  preferences,
  handlePreferenceChange,
  onNext,
}) => {
  return (
    <div className="step-content preferences-step">
      <form className="preferences-form" onSubmit={e => e.preventDefault()}>
        <SelectField
          label="Risk Tolerance"
          value={preferences.riskTolerance}
          options={RISK_TOLERANCE_OPTIONS as unknown as Option[]}
          onChange={value => handlePreferenceChange('riskTolerance', value)}
        />

        <SelectField
          label="Investment Style"
          value={preferences.investmentStyle}
          options={INVESTMENT_STYLE_OPTIONS as unknown as Option[]}
          onChange={value => handlePreferenceChange('investmentStyle', value)}
        />

        <CheckboxGridField
          label="Preferred Markets"
          options={MARKET_OPTIONS as unknown as string[]}
          selectedValues={preferences.preferredMarkets}
          onChange={values => handlePreferenceChange('preferredMarkets', values)}
        />

        <CheckboxGridField
          label="Preferred Trade Types"
          options={TRADE_TYPE_OPTIONS as unknown as string[]}
          selectedValues={preferences.preferredTradeTypes}
          onChange={values => handlePreferenceChange('preferredTradeTypes', values)}
        />

        <SelectField
          label="Trading Frequency"
          value={preferences.tradingFrequency}
          options={TRADING_FREQUENCY_OPTIONS as unknown as Option[]}
          onChange={value => handlePreferenceChange('tradingFrequency', value)}
        />

        <button type="button" className="next-step-button" onClick={onNext}>
          Next Step
        </button>
      </form>
    </div>
  );
};
