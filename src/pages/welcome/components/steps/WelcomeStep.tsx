import React from "react";
import { FEATURE_CARDS } from "./config";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <div className="step-content welcome-step">
      <div className="features-grid">
        {FEATURE_CARDS.map((feature) => (
          <div key={feature.title} className="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.content}</p>
          </div>
        ))}
      </div>
      <button type="button" className="next-step-button" onClick={onNext}>
        Next Step
      </button>
    </div>
  );
};
