import React from 'react';

interface StepperStep {
  id: string;
  title: string;
  description: string;
}

interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  completedSteps: number[];
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, completedSteps }) => {
  const getStepStatus = (stepIndex: number) => {
    if (completedSteps.includes(stepIndex)) {
      return 'completed';
    } else if (stepIndex === currentStep) {
      return 'active';
    } else {
      return 'pending';
    }
  };

  const getStepClasses = (status: string) => {
    const baseClasses = "size-7 flex justify-center items-center shrink-0 font-medium rounded-full";
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-500 text-white`;
      case 'active':
        return `${baseClasses} bg-green-600 text-white`;
      case 'pending':
        return `${baseClasses} bg-gray-100 text-gray-600`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  const getLineClasses = (status: string) => {
    const baseClasses = "w-full h-px flex-1";
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-500`;
      case 'active':
        return `${baseClasses} bg-green-600`;
      case 'pending':
        return `${baseClasses} bg-gray-200`;
      default:
        return `${baseClasses} bg-gray-200`;
    }
  };

  return (
    <div className="w-full">
      <ul className="relative flex flex-row gap-x-2">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;
          
          return (
            <li key={step.id} className="flex items-center gap-x-2 shrink basis-0 flex-1 group">
              <span className="min-w-7 min-h-7 group inline-flex items-center text-xs align-middle">
                <span className={getStepClasses(status)}>
                  {status === 'completed' ? (
                    <svg className="shrink-0 size-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </span>
                <span className="ms-2 text-sm font-medium text-gray-800">
                  {step.title}
                </span>
              </span>
              {!isLast && (
                <div className={getLineClasses(status)}></div>
              )}
            </li>
          );
        })}
      </ul>
      
      {/* Current step description */}
      <div className="mt-3 p-3 bg-green-50 rounded-md">
        <p className="text-sm text-green-700">
          <span className="font-medium">Step {currentStep + 1}:</span> {steps[currentStep]?.description}
        </p>
      </div>
    </div>
  );
};

export default Stepper;
