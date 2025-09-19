import React from 'react';
import { Input, Button } from '../index';
import { EmploymentDetailsData, EmploymentDetailsValidationErrors, validateEmploymentDetails } from '../../validation';

interface EmploymentDetailsStepProps {
  formData: EmploymentDetailsData;
  validationErrors: EmploymentDetailsValidationErrors;
  error: string;
  onEmployerNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMonthsAtEmployerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onIncomeSourceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPayFrequencyChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onMonthlyIncomeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const EmploymentDetailsStep: React.FC<EmploymentDetailsStepProps> = ({
  formData,
  validationErrors,
  error,
  onEmployerNameChange,
  onMonthsAtEmployerChange,
  onIncomeSourceChange,
  onPayFrequencyChange,
  onMonthlyIncomeChange,
  onPrevious,
  onNext
}) => {
  const incomeSourceOptions = [
    { value: "1", label: "Employment" },
    { value: "2", label: "Self-Employed" },
    { value: "3", label: "Unemployment Benefits" },
    { value: "4", label: "Social Security" },
    { value: "5", label: "Disability Benefits" },
    { value: "6", label: "Other" },
  ];

  const payFrequencyOptions = [
    { value: "1", label: "Weekly" },
    { value: "2", label: "Bi-Weekly" },
    { value: "3", label: "Monthly" },
    { value: "4", label: "Other" },
  ];

  // Validate form data using the schema
  const validationResult = validateEmploymentDetails(formData);
  const isFormValid = validationResult.isValid;

  return (
    <form className="flex-1 w-full">
      <div className="flex-1 w-full">
        {/* Employment Information - Responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employer Name <span className="text-red-500">*</span></label>
            <Input
              type="text"
              value={formData.employer_name}
              onChange={onEmployerNameChange}
              placeholder="Employer name"
              className={validationErrors.employer_name ? 'border-red-300 focus:border-red-500' : ''}
            />
            {validationErrors.employer_name && (
              <p className="text-red-500 text-xs">{validationErrors.employer_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Months at Employer <span className="text-red-500">*</span></label>
            <Input
              type="text"
              value={formData.months_at_employer}
              onChange={onMonthsAtEmployerChange}
              placeholder="Months"
              className={validationErrors.months_at_employer ? 'border-red-300 focus:border-red-500' : ''}
            />
            {validationErrors.months_at_employer && (
              <p className="text-red-500 text-xs">{validationErrors.months_at_employer}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income <span className="text-red-500">*</span></label>
            <Input
              type="text"
              value={formData.monthly_income}
              onChange={onMonthlyIncomeChange}
              placeholder="Monthly income"
              className={validationErrors.monthly_income ? 'border-red-300 focus:border-red-500' : ''}
            />
            {validationErrors.monthly_income && (
              <p className="text-red-500 text-xs">{validationErrors.monthly_income}</p>
            )}
          </div>
        </div>

        {/* Income Source and Pay Frequency - Responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source of Income <span className="text-red-500">*</span></label>
            <select
              value={formData.income_source}
              onChange={onIncomeSourceChange}
              className={`w-full px-3 py-2 border max-h-[40px] rounded-md focus:outline-none focus:ring-0 focus-within:ring-0 bg-white text-gray-500 ${validationErrors.income_source ? 'border-red-300 focus:border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select income source</option>
              {incomeSourceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {validationErrors.income_source && (
              <p className="text-red-500 text-xs">{validationErrors.income_source}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pay Frequency <span className="text-red-500">*</span></label>
            <select
              value={formData.pay_frequency}
              onChange={onPayFrequencyChange}
              className={`w-full px-3 py-2 border max-h-[40px] rounded-md focus:outline-none focus:ring-0 focus-within:ring-0 bg-white text-gray-500 ${validationErrors.pay_frequency ? 'border-red-300 focus:border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select pay frequency</option>
              {payFrequencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {validationErrors.pay_frequency && (
              <p className="text-red-500 text-xs">{validationErrors.pay_frequency}</p>
            )}
          </div>
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
            variant="outline"
            onClick={onPrevious}
          >
            Back
          </Button>
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

export default EmploymentDetailsStep;