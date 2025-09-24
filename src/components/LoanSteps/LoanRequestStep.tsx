import React from 'react';
import { LoanRequestData, LoanRequestValidationErrors } from '../../validation';
import { Button } from '../index';

interface LoanRequestStepProps {
  formData: LoanRequestData;
  validationErrors: LoanRequestValidationErrors;
  error: string;
  onLoanAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResidenceTypeClick: (value: string) => void;
  onNext: () => void;
}

const LoanRequestStep: React.FC<LoanRequestStepProps> = ({
  formData,
  validationErrors,
  error,
  onLoanAmountChange,
  onResidenceTypeClick,
  onNext
}) => {
  const residenceOptions = [
    { value: "Home Owner", label: "Home Owner" },
    { value: "Rent", label: "Rent" },
    { value: "Live with Family", label: "Live with Family" },
    { value: "Other", label: "Other" },
  ];

  const isFormValid = formData.loan_amount && formData.residence_type;

  return (
    <form className="flex-1 w-full">
      <div className="flex-1 w-full">
        {/* Loan Amount Section */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loan Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative  sm:w-80">
            <div className="flex border-[1px] shadow-sm pl-[8px] pr-[2px] border-gray-300 bg-white h-10 rounded-md">
              <span className="inline-flex items-center pr-[8px] text-gray-500 text-lg font-medium rounded-l-lg">
                $
              </span>

              <input
                id="loanAmount"
                name="loan_amount"
                value={formData.loan_amount}
                onChange={onLoanAmountChange}
                className="flex-1 text-lg py-[8px] border-0 focus:ring-0 focus:outline-none w-full rounded-r-lg"
                placeholder="0.00"
                style={{ appearance: "textfield", MozAppearance: "textfield" }}
                min="1"
                max="50000"
              />
            </div>
            {validationErrors.loan_amount && (
              <p className="text-red-500 text-xs">
                {validationErrors.loan_amount}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Maximum amount is $50,000.
            </p>
          </div>
        </div>

        {/* Residence Type Section */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Do you rent or own a home? <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <div className="flex flex-wrap gap-2">
              {residenceOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onResidenceTypeClick(option.value)}
                  className={`px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                    formData.residence_type === option.value
                      ? 'bg-gray-300 text-gray-900'
                      : 'bg-gray-100 border-gray-200 text-gray-700 hover:border-gray-300 '
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          {validationErrors.residence_type && (
            <p className="text-red-500 text-xs">
              {validationErrors.residence_type}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-[30px] border-gray-200 border-t-[1px] gap-1 flex justify-end">
          <Button
            type="button"
            variant="primary"
            onClick={onNext}
            disabled={!isFormValid}
          >
            Continue
          </Button>
        </div>
      </div>
    </form>
  );
};

export default LoanRequestStep;
