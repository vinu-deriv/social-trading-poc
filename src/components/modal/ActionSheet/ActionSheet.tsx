import { useEffect, useRef, useState } from "react";
import "./ActionSheet.css";

export interface ActionSheetAction {
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
  showFor?: "all" | "leader" | "copier";
}

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onExited?: () => void;
  actions: ActionSheetAction[];
  title?: string;
}

const ActionSheet: React.FC<ActionSheetProps> = ({
  isOpen,
  onClose,
  onExited,
  actions,
  title,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const [isVisible, setIsVisible] = useState(false);
  const [animationState, setAnimationState] = useState<"entering" | "exiting" | "">("");
  
  const handleAnimationEnd = () => {
    if (animationState === "exiting") {
      setIsVisible(false);
      onExited?.();
    }
  };

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setAnimationState("entering");
        } else {
            setAnimationState("exiting");
        }
    }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div 
      className={`action-sheet__overlay ${animationState}`} 
      onClick={handleBackdropClick}
    >
      <div 
        ref={sheetRef} 
        className={`action-sheet__container ${animationState}`}
        onAnimationEnd={handleAnimationEnd}
      >
        {title && (
          <div className="action-sheet__header">
            <h3>{title}</h3>
          </div>
        )}
        <div className="action-sheet__content">
          {actions.map((action, index) => (
            <button
              key={index}
              className="action-sheet__item"
              onClick={() => {
                action.onClick();
                onClose();
              }}
            >
              {action.icon && (
                <span className="action-sheet__item-icon">{action.icon}</span>
              )}
              <span className="action-sheet__item-label">{action.label}</span>
            </button>
          ))}
        </div>
        <button className="action-sheet__cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ActionSheet;
