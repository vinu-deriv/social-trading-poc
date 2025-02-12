import React from "react";
import { FormGroup } from "./FormGroup";
import { TradingPreferences } from "../../../../types/trading";

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
  suffix = "%",
}) => {
  return (
    <FormGroup label={label}>
      {helperText && <span className="helper-text">{helperText}</span>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) as TRiskTolerance)}
      />
      <span className="range-value">{value}{suffix}</span>
    </FormGroup>
  );
};
