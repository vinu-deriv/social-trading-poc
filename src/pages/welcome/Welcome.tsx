import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UserType } from "../../types/user";
// import { Button } from "@deriv-com/quill-ui";
import "./Welcome.css";

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Add debug log

    // If user is not a copier or not first time, redirect to feed
    if (!user || user.userType !== UserType.COPIER || user.isFirstLogin !== true) {
      navigate("/feed", { replace: true });
    }
  }, [user, navigate]);

  const handleGetStarted = async () => {
    try {
      // Here you would typically make an API call to update user's isFirstLogin status
      await fetch(`http://localhost:3001/users/${user?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isFirstLogin: false }),
      });

      // Update local storage to reflect the change
      const authData = localStorage.getItem("auth");
      if (authData) {
        const parsed = JSON.parse(authData);
        parsed.user.isFirstLogin = false;
        localStorage.setItem("auth", JSON.stringify(parsed));
      }

      navigate("/feed", { replace: true });
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  return (
    <div className="welcome-page">
      <div className="welcome-content">
        <img src="/vite.svg" alt="Logo" className="welcome-logo" />
        <h1>Welcome to Champion Social Trade!</h1>

        <div className="welcome-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Explore Top Traders</h3>
              <p>
                Browse through our community of successful traders and view
                their performance metrics.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Choose Your Strategy</h3>
              <p>
                Select trading strategies that match your investment goals and
                risk tolerance.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Start Copy Trading</h3>
              <p>
                Set up your copying preferences and let our system automatically
                replicate trades for you.
              </p>
            </div>
          </div>
        </div>

        {/* <Button
          variant="primary"
          size="md"
          onClick={handleGetStarted}
          className="get-started-button"
        >
          Get Started
        </Button> */}
        <button onClick={handleGetStarted} className="get-started-button">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Welcome;
