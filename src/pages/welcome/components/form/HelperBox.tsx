import React from 'react';
import './HelperBox.css';

interface HelperBoxProps {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'error' | 'success';
}

export const HelperBox: React.FC<HelperBoxProps> = ({ children, type }) => {
  return <div className={`helper-box ${type ? `helper-box--${type}` : ''}`}>{children}</div>;
};
