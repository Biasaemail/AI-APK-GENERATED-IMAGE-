
import React from 'react';

interface AlertProps {
  message: string;
  type?: 'error' | 'info';
}

const Alert: React.FC<AlertProps> = ({ message, type = 'error' }) => {
  const baseClasses = "p-4 rounded-md text-sm font-medium";
  const typeClasses = type === 'error'
    ? "bg-red-900/50 text-red-300 border border-red-700"
    : "bg-blue-900/50 text-blue-300 border border-blue-700";

  return (
    <div className={`${baseClasses} ${typeClasses}`} role="alert">
      {message}
    </div>
  );
};

export default Alert;
