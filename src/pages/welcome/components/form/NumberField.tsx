import React from "react";
import { FormGroup } from "./FormGroup";
import { TradingPreferences } from "../../../../types/trading";

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
      {helperText && <span className="helper-text">{helperText}</span>}
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) as TRiskTolerance)}
        className={`${className || ""} ${error ? "error" : ""}`}
      />
      {error && <span className="error-text">{error}</span>}
    </FormGroup>
  );
};
