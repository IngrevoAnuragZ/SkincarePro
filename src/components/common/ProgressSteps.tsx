import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  onChange?: (stepId: number) => void;
  className?: string;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  currentStep,
  onChange,
  className = '',
}) => {
  const handleStepClick = (stepId: number) => {
    if (onChange && stepId <= Math.max(...steps.map(s => s.id).filter(id => id <= currentStep))) {
      onChange(stepId);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <button
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-all duration-200 ${
                  step.id < currentStep
                    ? 'border-success-500 bg-success-500 text-white cursor-pointer'
                    : step.id === currentStep
                    ? 'border-primary-500 bg-primary-500 text-white cursor-default'
                    : 'border-neutral-300 bg-white text-neutral-400 cursor-default'
                }`}
                onClick={() => handleStepClick(step.id)}
                disabled={step.id > currentStep}
                aria-current={step.id === currentStep ? 'step' : undefined}
              >
                {step.id < currentStep ? (
                  <Check size={18} />
                ) : (
                  step.id
                )}
              </button>
              
              {/* Step Label */}
              <span 
                className={`mt-2 text-xs font-medium ${
                  step.id === currentStep
                    ? 'text-primary-600'
                    : step.id < currentStep
                    ? 'text-success-600'
                    : 'text-neutral-500'
                }`}
              >
                {step.label}
              </span>
            </div>
            
            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div 
                className={`flex-1 h-0.5 mx-2 ${
                  step.id < currentStep && steps[index + 1].id <= currentStep
                    ? 'bg-success-500'
                    : 'bg-neutral-300'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;