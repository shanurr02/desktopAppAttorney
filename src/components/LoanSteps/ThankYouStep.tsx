import React from 'react';
import { Button } from '../index';

interface ThankYouStepProps {
  onStartNewApplication: () => void;
}

const ThankYouStep: React.FC<ThankYouStepProps> = ({
  onStartNewApplication
}) => {
  return (
    <div className="flex-1 w-full">
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        {/* Thank You Message Section */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-6 w-full max-w-2xl">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Thank you for completing the application.
            </h1>
            <p className="text-gray-600 text-lg">
              The client will receive a notification on their registered email address.
            </p>
          </div>
        </div>

        {/* Separator Line */}
        <div className="w-full max-w-2xl border-t border-gray-200 mb-8"></div>

        {/* Call-to-Action Button Section */}
        <div className="w-full max-w-2xl">
          <Button
            type="button"
            variant="primary"
            onClick={onStartNewApplication}
            className="px-8 py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm transition-colors duration-200"
          >
            Start New Application
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouStep;
