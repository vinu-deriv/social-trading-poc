import React from "react";

interface HelperBoxProps {
  children: React.ReactNode;
}

export const HelperBox: React.FC<HelperBoxProps> = ({ children }) => {
  return <div className="helper-box">{children}</div>;
};
