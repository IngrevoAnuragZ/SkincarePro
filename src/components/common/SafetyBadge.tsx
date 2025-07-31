import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

type SafetyLevel = 'safe' | 'caution' | 'unsafe';

interface SafetyBadgeProps {
  level: SafetyLevel;
  label?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SafetyBadge: React.FC<SafetyBadgeProps> = ({
  level,
  label,
  showIcon = true,
  size = 'md',
  className = '',
}) => {
  const getLabel = () => {
    if (label) return label;
    
    switch (level) {
      case 'safe':
        return 'Safe';
      case 'caution':
        return 'Use with Caution';
      case 'unsafe':
        return 'Avoid';
      default:
        return '';
    }
  };
  
  const getIcon = () => {
    switch (level) {
      case 'safe':
        return <CheckCircle size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} className="text-success-600" />;
      case 'caution':
        return <AlertTriangle size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} className="text-warning-600" />;
      case 'unsafe':
        return <AlertCircle size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} className="text-error-600" />;
      default:
        return null;
    }
  };

  const baseClasses = 'inline-flex items-center rounded-full font-medium';
  
  const levelClasses = {
    safe: 'bg-success-100 text-success-800 border border-success-200',
    caution: 'bg-warning-100 text-warning-800 border border-warning-200',
    unsafe: 'bg-error-100 text-error-800 border border-error-200',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };
  
  return (
    <span className={`${baseClasses} ${levelClasses[level]} ${sizeClasses[size]} ${className}`}>
      {showIcon && <span className="mr-1.5">{getIcon()}</span>}
      {getLabel()}
    </span>
  );
};

export default SafetyBadge;