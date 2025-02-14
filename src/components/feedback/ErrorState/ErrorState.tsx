import { FC } from "react";
import NetworkErrorIcon from "@/assets/icons/NetworkErrorIcon";
import Button from "@/components/input/Button";
import "./ErrorState.css";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState: FC<ErrorStateProps> = ({ message, onRetry }) => (
  <div className="error-state">
    <div className="error-state__icon">
      <NetworkErrorIcon />
    </div>
    <p className="error-state__message">{message}</p>
    {onRetry && (
      <Button onClick={onRetry} variant="primary">
        Try Again
      </Button>
    )}
  </div>
);

export default ErrorState;
