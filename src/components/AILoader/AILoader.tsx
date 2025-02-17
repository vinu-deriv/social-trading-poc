import React from 'react';
import './AILoader.css';

interface AILoaderProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

const AILoader: React.FC<AILoaderProps> = ({ 
  size = 40, 
  className = '',
  showText = true
}) => {
  const uniqueId = React.useId();
  const gradientId = `gradient-${uniqueId}`;

  return (
    <div 
      className={`ai-loader ${className}`} 
      style={{ 
        width: size, 
        height: size + (showText ? 24 : 0)
      }}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="ai-loader__svg"
        width={size}
        height={size}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#0066ff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#00ccff', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Main rotating ring with wave effect */}
        <circle 
          cx="50" 
          cy="50" 
          r="40" 
          fill="none" 
          stroke={`url(#${gradientId})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="1,150"
          transform="rotate(-90 50 50)"
        >
          {/* Rotation animation */}
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="-90 50 50"
            to="270 50 50"
            dur="1.4s"
            repeatCount="indefinite"
          />
          {/* Wave-like thickness animation */}
          <animate
            attributeName="stroke-dasharray"
            values="1,150;90,150;1,150"
            dur="1.4s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
          />
          {/* Varying stroke width for more dynamic effect */}
          <animate
            attributeName="stroke-width"
            values="4;6;4"
            dur="1.4s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
          />
        </circle>
        
        {/* Subtle glow effect */}
        <circle 
          cx="50" 
          cy="50" 
          r="35"
          fill="none"
          stroke="#0066ff"
          strokeWidth="1"
          opacity="0.2"
        >
          <animate
            attributeName="opacity"
            values="0.2;0.1;0.2"
            dur="1.4s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
          />
        </circle>
      </svg>
      {showText && (
        <div className="ai-loader__text">
          Analyzing with AI...
        </div>
      )}
    </div>
  );
};

export default AILoader;
