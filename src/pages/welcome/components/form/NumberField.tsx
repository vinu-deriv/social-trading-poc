import React from 'react';
import './NumberField.css';
import { FormGroup } from './FormGroup';
import { TradingPreferences } from '../../../../types/trading';

type TRiskTolerance = TradingPreferences[keyof TradingPreferences];

interface NumberFieldProps {
  label: string;
  helperText?: string;
  value: number;
  min?: number;
  step?: number;
  onChange: (value: TRiskTolerance) => void;
  error?: string;
  className?: string;
}

export const NumberField: React.FC<NumberFieldProps> = ({
  label,
  helperText,
  value,
  min,
  step = 1,
  onChange,
  error,
  className,
}) => {
  return (
    <FormGroup label={label}>
      <div className={`number-field ${className || ''} ${error ? 'number-field--error' : ''}`}>
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value) as TRiskTolerance)}
          className="number-field__input"
        />
        {helperText && !error && <span className="number-field__helper-text">{helperText}</span>}
        {error && <span className="number-field__error">{error}</span>}
      </div>
    </FormGroup>
  );
};
