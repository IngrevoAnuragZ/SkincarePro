import React from 'react';
import { Info } from 'lucide-react';
import SafetyBadge from '../common/SafetyBadge';

type SafetyLevel = 'safe' | 'caution' | 'unsafe';

interface IngredientCardProps {
  name: string;
  alternativeName?: string;
  description: string;
  safetyLevel: SafetyLevel;
  benefitsFor?: string[];
  concerns?: string[];
  onClick?: () => void;
}

const IngredientCard: React.FC<IngredientCardProps> = ({
  name,
  alternativeName,
  description,
  safetyLevel,
  benefitsFor = [],
  concerns = [],
  onClick,
}) => {
  return (
    <div 
      className="card hover:shadow-xl cursor-pointer transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          {alternativeName && (
            <p className="text-sm text-neutral-500">{alternativeName}</p>
          )}
        </div>
        <SafetyBadge level={safetyLevel} />
      </div>
      
      <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{description}</p>
      
      {(benefitsFor.length > 0 || concerns.length > 0) && (
        <div className="border-t border-neutral-100 pt-3">
          {benefitsFor.length > 0 && (
            <div className="mb-2">
              <p className="text-xs font-medium text-neutral-500 mb-1">Benefits for:</p>
              <div className="flex flex-wrap gap-1">
                {benefitsFor.map((benefit, index) => (
                  <span 
                    key={index} 
                    className="inline-block text-xs bg-success-50 text-success-700 rounded-full px-2 py-0.5"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {concerns.length > 0 && (
            <div>
              <p className="text-xs font-medium text-neutral-500 mb-1">Concerns:</p>
              <div className="flex flex-wrap gap-1">
                {concerns.map((concern, index) => (
                  <span 
                    key={index} 
                    className="inline-block text-xs bg-error-50 text-error-700 rounded-full px-2 py-0.5"
                  >
                    {concern}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <button 
        className="mt-4 text-primary-600 text-sm font-medium flex items-center hover:text-primary-700 transition-colors"
      >
        <Info size={16} className="mr-1" />
        Full Details
      </button>
    </div>
  );
};

export default IngredientCard;