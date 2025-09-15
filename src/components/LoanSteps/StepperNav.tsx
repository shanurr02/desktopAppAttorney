import React from 'react';

interface StepperNavProps {
  currentStep: number;
  completedSteps: number[];
  steps: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}

const StepperNav: React.FC<StepperNavProps> = ({ currentStep, completedSteps, steps }) => {
  // Show all 4 steps
  const stepLabels = [
    steps[0]?.title || "Step",
    steps[1]?.title || "Step",
    steps[2]?.title || "Step",
    steps[3]?.title || "Step",
  ];

  return (
    <ul className="relative flex flex-col sm:flex-row gap-2 sm:gap-x-2 rounded-md border bg-gray-50 text-card-foreground shadow-sm p-4">
      {stepLabels.map((label, idx) => {
        // Stepper logic for active/completed
        const isActive = currentStep === idx;
        const isCompleted = completedSteps.includes(idx);
        // For the last item, don't show the connecting line
        const isLast = idx === stepLabels.length - 1;
        
        return (
          <li
            key={idx}
            className={`flex items-center gap-x-2 shrink basis-0 flex-1 group${isActive ? " active" : ""}`}
            data-hs-stepper-nav-item={`{ "index": ${idx + 1} }`}
          >
            <span className="min-w-7 min-h-7 group inline-flex items-center text-xs align-middle focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none">
              <span
                className={
                  [
                    "size-7 flex justify-center items-center shrink-0 font-medium rounded-full",
                    "bg-gray-100 text-gray-800 group-focus:bg-gray-200",
                    isActive
                      ? "bg-green-600 text-white"
                      : isCompleted
                        ? "bg-green-500 text-white"
                        : "",
                    // dark mode classes omitted for brevity
                  ].join(" ")
                }
              >
                {!isCompleted ? (
                  <span>{idx + 1}</span>
                ) : (
                  <svg className="shrink-0 size-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </span>
              <span className="ms-2 text-sm font-medium text-gray-800 group-focus:text-gray-500 hidden sm:block">
                {label}
              </span>
            </span>
            {!isLast && (
              <div
                className={
                  [
                    "w-full h-px flex-1 bg-gray-200 group-last:hidden hidden sm:block",
                    isCompleted ? "bg-green-600" : "",
                    // dark mode classes omitted for brevity
                  ].join(" ")
                }
              ></div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default StepperNav;
