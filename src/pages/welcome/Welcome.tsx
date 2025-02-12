import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UserType } from "../../types/user";
import {
  TradingPreferences,
  MARKET_OPTIONS,
  WelcomeStep,
} from "../../types/trading";
import "./Welcome.css";

const STEPS: { [key in WelcomeStep]: { title: string; description: string } } =
  {
    welcome: {
      title: "Welcome to Champion Social Trade",
      description: "Learn about our copy trading platform",
    },
    preferences: {
      title: "Trading Preferences",
      description: "Help us personalize your trading experience",
    },
    risk: {
      title: "Risk Management",
      description: "Set your trading limits",
    },
  };

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<WelcomeStep>("welcome");
  const [preferences, setPreferences] = useState<TradingPreferences>({
    riskTolerance: "medium",
    investmentStyle: "moderate",
    preferredMarkets: [],
    tradingFrequency: "weekly",
    maxDrawdown: 20,
    targetReturn: 15,
    minStake: 10,
    maxStake: 100,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
    if (
      !user ||
      user.userType !== UserType.COPIER ||
      user.isFirstLogin !== true
    ) {
      navigate("/feed", { replace: true });
    }
  }, [user, navigate]);

  const handleNext = async () => {
    if (currentStep === "welcome") {
      setCurrentStep("preferences");
    } else if (currentStep === "preferences") {
      setCurrentStep("risk");
    } else {
      try {
        await fetch(`http://localhost:3001/users/${user?.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isFirstLogin: false,
            tradingPreferences: preferences,
          }),
        });

        const authData = localStorage.getItem("auth");
        if (authData) {
          const parsed = JSON.parse(authData);
          parsed.user.isFirstLogin = false;
          parsed.user.tradingPreferences = preferences;
          localStorage.setItem("auth", JSON.stringify(parsed));
        }

        navigate("/feed", { replace: true });
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    }
  };

  const handlePreferenceChange = (
    key: keyof TradingPreferences,
    value: any
  ) => {
    setPreferences((prev) => {
      const newPreferences = { ...prev, [key]: value };

      // Validate stake values
      if (key === "minStake") {
        if (value > prev.maxStake) {
          newPreferences.maxStake = value;
        }
      } else if (key === "maxStake") {
        if (value < prev.minStake) {
          newPreferences.minStake = value;
        }
      }

      return newPreferences;
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <div className="step-content welcome-step">
            <h2>Welcome to Champion Social Trade!</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Copy Top Traders</h3>
                <p>
                  Follow and automatically copy trades from successful traders.
                  Our platform makes it easy to replicate their winning
                  strategies.
                </p>
              </div>
              <div className="feature-card">
                <h3>Smart Analytics</h3>
                <p>
                  Get detailed insights into trader performance, risk metrics,
                  and historical success rates to make informed decisions.
                </p>
              </div>
              <div className="feature-card">
                <h3>Risk Management</h3>
                <p>
                  Set your own risk parameters and let our system automatically
                  adjust trade sizes to protect your capital.
                </p>
              </div>
              <div className="feature-card">
                <h3>AI-Powered Matching</h3>
                <p>
                  Our AI system matches you with traders who best fit your
                  trading style and risk tolerance.
                </p>
              </div>
            </div>
          </div>
        );

      case "preferences":
        return (
          <div className="step-content preferences-step">
            <form className="preferences-form">
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
                          handlePreferenceChange(
                            "preferredMarkets",
                            newMarkets
                          );
                        }}
                      />
                      {market}
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
                    handlePreferenceChange(
                      "maxDrawdown",
                      Number(e.target.value)
                    )
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
                    handlePreferenceChange(
                      "targetReturn",
                      Number(e.target.value)
                    )
                  }
                />
                <span className="range-value">{preferences.targetReturn}%</span>
              </div>
            </form>
          </div>
        );

      case "risk":
        return (
          <div className="step-content risk-step">
            <form className="preferences-form">
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
                  These limits will be used to control your position sizes when
                  copying trades. The system will automatically adjust the
                  copied trade amounts to stay within your specified range.
                </p>
              </div>
            </form>
          </div>
        );
    }
  };

  return (
    <div className="welcome-page">
      <div className="progress-bar">
        {Object.entries(STEPS).map(([step, { title, description }]) => (
          <div
            key={step}
            className={`progress-step ${step === currentStep ? "active" : ""} ${
              Object.keys(STEPS).indexOf(step) <
              Object.keys(STEPS).indexOf(currentStep)
                ? "completed"
                : ""
            }`}
          >
            <div className="step-indicator">
              {Object.keys(STEPS).indexOf(step) <
              Object.keys(STEPS).indexOf(currentStep) ? (
                <svg
                  className="tick-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                Object.keys(STEPS).indexOf(step) + 1
              )}
            </div>
            <div className="step-details">
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="welcome-content">
        {renderStepContent()}

        <button onClick={handleNext} className="next-step-button">
          {currentStep === "risk" ? "Get Started" : "Next Step"}
        </button>
      </div>
    </div>
  );
};

export default Welcome;
