import React from 'react';

interface LogoProps {
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ height = 40, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/logo.png" 
        alt="Ingrevo Logo" 
        style={{ height: `${height}px` }}
        className="mr-2"
      />
    </div>
  );
};

export default Logo;