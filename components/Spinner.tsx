import React from 'react';

interface SpinnerProps {
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className = "h-8 w-8" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
    <g fill="none" strokeWidth="4" strokeLinecap="round">
      <path
        stroke="url(#spinner-gradient)"
        strokeOpacity=".3"
        d="M24 4 A 20 20 0 0 1 44 24"
      />
      <path
        stroke="url(#spinner-gradient)"
        d="M4 24 A 20 20 0 0 1 24 4"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 24 24"
          to="360 24 24"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </path>
    </g>
  </svg>
);

export default Spinner;