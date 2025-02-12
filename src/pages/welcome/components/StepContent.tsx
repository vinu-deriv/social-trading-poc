import {
  TradingPreferences,
  WelcomeStep,
  MARKET_OPTIONS,
  TRADE_TYPE_OPTIONS,
  WELCOME_STEPS,
} from "../../../types/trading";

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
      return (
        <div className="step-content welcome-step">
          <div className="features-grid">
            <div className="feature-card">
              <h3>Expert Traders</h3>
              <p>
                Follow and copy trades from successful traders with proven track
                records.
              </p>
            </div>
            <div className="feature-card">
              <h3>Risk Management</h3>
              <p>
                Set your risk levels and investment limits to trade within your
                comfort zone.
              </p>
            </div>
            <div className="feature-card">
              <h3>Real-Time Updates</h3>
              <p>
                Stay informed with instant notifications and performance
                tracking.
              </p>
            </div>
            <div className="feature-card">
              <h3>AI-Powered Matching</h3>
              <p>
                Our AI system matches you with traders who best fit your trading
                style and risk tolerance.
              </p>
            </div>
          </div>
          <button type="button" className="next-step-button" onClick={onNext}>
            Next Step
          </button>
        </div>
      );

    case WELCOME_STEPS.PREFERENCES:
      return (
        <div className="step-content preferences-step">
          <form
            className="preferences-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="form-group">
              <label>Risk Tolerance</label>
              <select
                value={preferences.riskTolerance}
                onChange={(e) =>
                  handlePreferenceChange("riskTolerance", e.target.value)
                }
              >
                <option value="low">Low - Safety First</option>
                <option value="medium">Medium - Balanced Approach</option>
                <option value="high">High - Maximum Growth</option>
              </select>
            </div>

            <div className="form-group">
              <label>Investment Style</label>
              <select
                value={preferences.investmentStyle}
                onChange={(e) =>
                  handlePreferenceChange("investmentStyle", e.target.value)
                }
              >
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>

            <div className="form-group">
              <label>Preferred Markets</label>
              <div className="markets-grid">
                {MARKET_OPTIONS.map((market) => (
                  <label key={market} className="market-option">
                    <input
                      type="checkbox"
                      checked={preferences.preferredMarkets.includes(market)}
                      onChange={(e) => {
                        const newMarkets = e.target.checked
                          ? [...preferences.preferredMarkets, market]
                          : preferences.preferredMarkets.filter(
                              (m) => m !== market
                            );
                        handlePreferenceChange("preferredMarkets", newMarkets);
                      }}
                    />
                    {market}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Preferred Trade Types</label>
              <div className="markets-grid">
                {TRADE_TYPE_OPTIONS.map((tradeType) => (
                  <label key={tradeType} className="market-option">
                    <input
                      type="checkbox"
                      checked={preferences.preferredTradeTypes.includes(
                        tradeType
                      )}
                      onChange={(e) => {
                        const newTradeTypes = e.target.checked
                          ? [...preferences.preferredTradeTypes, tradeType]
                          : preferences.preferredTradeTypes.filter(
                              (t) => t !== tradeType
                            );
                        handlePreferenceChange(
                          "preferredTradeTypes",
                          newTradeTypes
                        );
                      }}
                    />
                    {tradeType}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Trading Frequency</label>
              <select
                value={preferences.tradingFrequency}
                onChange={(e) =>
                  handlePreferenceChange("tradingFrequency", e.target.value)
                }
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <button type="button" className="next-step-button" onClick={onNext}>
              Next Step
            </button>
          </form>
        </div>
      );

    case WELCOME_STEPS.RISK:
      return (
        <div className="step-content risk-step">
          <form
            className="preferences-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="form-group">
              <label>
                Maximum Drawdown (%)
                <span className="helper-text">
                  Maximum loss you're willing to accept
                </span>
              </label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={preferences.maxDrawdown}
                onChange={(e) =>
                  handlePreferenceChange("maxDrawdown", Number(e.target.value))
                }
              />
              <span className="range-value">{preferences.maxDrawdown}%</span>
            </div>

            <div className="form-group">
              <label>
                Target Annual Return (%)
                <span className="helper-text">
                  Your desired yearly return on investment
                </span>
              </label>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={preferences.targetReturn}
                onChange={(e) =>
                  handlePreferenceChange("targetReturn", Number(e.target.value))
                }
              />
              <span className="range-value">{preferences.targetReturn}%</span>
            </div>

            <div className="form-group">
              <label>
                Minimum Stake ($)
                <span className="helper-text">
                  Minimum amount to invest per trade
                </span>
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={preferences.minStake}
                onChange={(e) =>
                  handlePreferenceChange("minStake", Number(e.target.value))
                }
                className={`stake-input ${
                  preferences.minStake > preferences.maxStake ? "error" : ""
                }`}
              />
              {preferences.minStake > preferences.maxStake && (
                <span className="error-text">
                  Minimum stake cannot be greater than maximum stake
                </span>
              )}
            </div>

            <div className="form-group">
              <label>
                Maximum Stake ($)
                <span className="helper-text">
                  Maximum amount to invest per trade
                </span>
              </label>
              <input
                type="number"
                min={preferences.minStake}
                step="1"
                value={preferences.maxStake}
                onChange={(e) =>
                  handlePreferenceChange("maxStake", Number(e.target.value))
                }
                className={`stake-input ${
                  preferences.maxStake < preferences.minStake ? "error" : ""
                }`}
              />
              {preferences.maxStake < preferences.minStake && (
                <span className="error-text">
                  Maximum stake cannot be less than minimum stake
                </span>
              )}
            </div>

            <div className="helper-box">
              <p>
                These settings help us ensure your trading activity aligns with
                your risk tolerance and investment goals.
              </p>
            </div>

            <button
              type="button"
              className="next-step-button"
              onClick={onNext}
              disabled={preferences.minStake > preferences.maxStake}
            >
              Get Started
            </button>
          </form>
        </div>
      );

    default:
      return null;
  }
};

export default StepContent;
