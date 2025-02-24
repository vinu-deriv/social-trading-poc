import React, { useState } from 'react';
import './RangeField.css';
import { FormGroup } from './FormGroup';
import { TradingPreferences } from '../../../../types/trading';

type TRiskTolerance = TradingPreferences[keyof TradingPreferences];

interface RangeFieldProps {
  label: string;
  helperText?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: TRiskTolerance) => void;
  suffix?: string;
}

export const RangeField: React.FC<RangeFieldProps> = ({
  label,
  helperText,
  value,
  min,
  max,
  step,
  onChange,
  suffix = '%',
}) => {
  const [percentage, setPercentage] = useState(((value - min) * 100) / (max - min));

  const handleRangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    const newPercentage = ((newValue - min) * 100) / (max - min);
    setPercentage(newPercentage);
    onChange(newValue as TRiskTolerance);
  };

  return (
    <FormGroup label={label}>
      <div className="range-field">
        <input
          type="range"
          className="range-field__input"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleRangeInput}
          style={{
            background: `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${percentage}%, var(--border-color) ${percentage}%, var(--border-color) 100%)`,
          }}
        />
        <div className="range-field__info">
          {helperText && <span className="range-field__helper-text">{helperText}</span>}
          <span className="range-field__value">
            - {value}
            {suffix}
          </span>
        </div>
      </div>
    </FormGroup>
  );
};
