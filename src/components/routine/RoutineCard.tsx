import React from 'react';
import { Edit, Trash, ArrowRight, Clock } from 'lucide-react';

interface RoutineStep {
  id: string;
  productName: string;
  productType: string;
  timing?: string;
  imageUrl?: string;
  description?: string;
}

interface RoutineCardProps {
  title: string;
  time: 'morning' | 'afternoon' | 'evening';
  steps: RoutineStep[];
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

const RoutineCard: React.FC<RoutineCardProps> = ({
  title,
  time,
  steps,
  onEdit,
  onDelete,
  onClick,
}) => {
  const renderTimeIcon = () => {
    if (time === 'morning') {
      return (
        <div className="h-10 w-10 rounded-full bg-warning-100 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="4" fill="#EAB308" />
            <path d="M12 2V4" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 20V22" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
            <path d="M4.93 4.93L6.34 6.34" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
            <path d="M17.66 17.66L19.07 19.07" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
            <path d="M2 12H4" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
            <path d="M20 12H22" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
            <path d="M6.34 17.66L4.93 19.07" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
            <path d="M19.07 4.93L17.66 6.34" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );
    } else if (time === 'afternoon') {
      return (
        <div className="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="4" fill="#F97316" />
            <path d="M12 2V4" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 20V22" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
            <path d="M4.93 4.93L6.34 6.34" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
            <path d="M17.66 17.66L19.07 19.07" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
            <path d="M2 12H4" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
            <path d="M20 12H22" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
            <path d="M6.34 17.66L4.93 19.07" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
            <path d="M19.07 4.93L17.66 6.34" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="#7353BA" />
            <path d="M15.88 15.29L11.29 10.7C11.1 10.51 11 10.26 11 10V6C11 5.45 11.45 5 12 5C12.55 5 13 5.45 13 6V9.59L17.29 13.88C17.68 14.27 17.68 14.91 17.29 15.29C16.91 15.68 16.27 15.68 15.88 15.29Z" fill="#7353BA" />
          </svg>
        </div>
      );
    }
  };

  return (
    <div 
      className="card hover:shadow-lg cursor-pointer transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          {renderTimeIcon()}
          <div className="ml-3">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-neutral-500 capitalize">{time} Routine</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {onEdit && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
            >
              <Edit size={16} className="text-neutral-600" />
            </button>
          )}
          
          {onDelete && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 rounded-full bg-neutral-100 hover:bg-error-100 transition-colors"
            >
              <Trash size={16} className="text-neutral-600 hover:text-error-600" />
            </button>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        {steps.slice(0, 3).map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="h-7 w-7 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-sm font-medium mr-3">
              {index + 1}
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <p className="font-medium text-neutral-800">{step.productName}</p>
                {step.timing && (
                  <div className="flex items-center text-xs text-neutral-500">
                    <Clock size={12} className="mr-1" />
                    {step.timing}
                  </div>
                )}
              </div>
              <p className="text-xs text-neutral-500">{step.productType}</p>
            </div>
          </div>
        ))}
        
        {steps.length > 3 && (
          <div className="text-sm text-primary-600 font-medium mt-2 flex items-center">
            <span>{steps.length - 3} more steps</span>
            <ArrowRight size={16} className="ml-1" />
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-between items-center">
        <p className="text-sm text-neutral-600">{steps.length} products</p>
        <span className="text-sm font-medium text-primary-600 flex items-center">
          View Details
          <ArrowRight size={14} className="ml-1" />
        </span>
      </div>
    </div>
  );
};

export default RoutineCard;