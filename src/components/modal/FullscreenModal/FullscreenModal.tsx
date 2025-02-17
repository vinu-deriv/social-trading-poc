import { ReactNode, useState, useEffect, useCallback } from "react";
import CloseIcon from "@/assets/icons/CloseIcon";
import "./FullscreenModal.css";

interface FullscreenModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExited?: () => void;
    title: string;
    children: ReactNode;
}

const FullscreenModal = ({ isOpen, onClose, onExited, title, children }: FullscreenModalProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [animationState, setAnimationState] = useState<"entering" | "exiting" | "">("");

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setAnimationState("entering");
        } else {
            setAnimationState("exiting");
        }
    }, [isOpen]);

    const handleAnimationEnd = useCallback(() => {
        if (animationState === "exiting") {
            setIsVisible(false);
            onExited?.();
        }
    }, [animationState, onExited]);

    if (!isVisible) return null;

    return (
        <div 
            className={`fullscreen-modal ${animationState}`}
            onAnimationEnd={handleAnimationEnd}
        >
            <div className="fullscreen-modal__content">
                <header className="fullscreen-modal__header">
                    <button 
                        className="fullscreen-modal__close" 
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <CloseIcon />
                    </button>
                    <h2 className="fullscreen-modal__title">{title}</h2>
                </header>
                <div className="fullscreen-modal__body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default FullscreenModal;
