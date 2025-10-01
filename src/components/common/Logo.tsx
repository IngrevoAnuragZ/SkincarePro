import React from 'react';
import { Sparkles } from 'lucide-react';

interface LogoProps {
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ height = 40, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
          <Sparkles size={24} className="text-white" />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
          Ingrevo
        </span>
      </div>
    </div>
  );
};

export default Logo;