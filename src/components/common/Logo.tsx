import React from 'react';
import { Sparkles } from 'lucide-react';

interface LogoProps {
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ height = 40, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Sparkles size={height * 0.8} className="mr-2" />
      <span className="text-2xl font-semibold">Ingrevo</span>
    </div>
  );
};

export default Logo;