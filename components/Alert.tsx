
import React from 'react';

interface AlertProps {
  message: string;
  type?: 'error' | 'info';
}

const Alert: React.FC<AlertProps> = ({ message, type = 'error' }) => {
  const baseClasses = "p-4 rounded-md text-sm font-medium border";
  const typeClasses = type === 'error'
    ? "bg-red-500/10 text-red-400 border-red-500/30"
    : "bg-blue-500/10 text-blue-400 border-blue-500/30";

  return (
    <div className={`${baseClasses} ${typeClasses}`} role="alert">
      {message}
    </div>
  );
};

export default Alert;