import React, { useEffect, useState } from 'react';
import CloseIcon from '@/assets/icons/CloseIcon';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExited?: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onExited, title, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationState, setAnimationState] = useState<'entering' | 'exiting' | ''>('');

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setAnimationState('entering');
      document.body.style.overflow = 'hidden';
    } else {
      setAnimationState('exiting');
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (animationState === 'exiting') {
      setIsVisible(false);
      onExited?.();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`modal__overlay ${animationState}`} onClick={handleBackdropClick}>
      <div className={`modal__container ${animationState}`} onAnimationEnd={handleAnimationEnd}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>
        <div className="modal__content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
