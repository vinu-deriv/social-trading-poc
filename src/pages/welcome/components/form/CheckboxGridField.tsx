import React from "react";
import { TradingPreferences } from "../../../../types/trading";
import { FormGroup } from "./FormGroup";

type TRiskTolerance = TradingPreferences[keyof TradingPreferences];

interface CheckboxGridFieldProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: TRiskTolerance) => void;
}

export const CheckboxGridField: React.FC<CheckboxGridFieldProps> = ({
  label,
  options,
  selectedValues,
  onChange,
}) => {
  return (
    <FormGroup label={label}>
      <div className="markets-grid">
        {options.map((option) => (
          <label key={option} className="market-option">
            <input
              type="checkbox"
              checked={selectedValues.includes(option)}
              onChange={(e) => {
                const newValues = e.target.checked
                  ? [...selectedValues, option]
                  : selectedValues.filter((v) => v !== option);
                onChange(newValues as TRiskTolerance);
              }}
            />
            {option}
          </label>
        ))}
      </div>
    </FormGroup>
  );
};
