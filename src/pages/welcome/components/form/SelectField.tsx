import React from "react";
import { TradingPreferences } from "../../../../types/trading";
import { FormGroup } from "./FormGroup";

type TRiskTolerance = TradingPreferences[keyof TradingPreferences];

export interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: TRiskTolerance) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <FormGroup label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TRiskTolerance)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormGroup>
  );
};
