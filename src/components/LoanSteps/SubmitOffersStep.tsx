import React, { useState } from 'react';
import { Button } from '../index';
import { LoanFormData, LoanValidationErrors } from '../../validation';

interface SubmitOffersStepProps {
  formData: LoanFormData;
  validationErrors: LoanValidationErrors;
  error: string;
  isSubmitting: boolean;
  onPrevious: () => void;
  onSubmit: () => void;
  successMessage?: string;
}

const SubmitOffersStep: React.FC<SubmitOffersStepProps> = ({
  formData,
  validationErrors,
  error,
  isSubmitting,
  onPrevious,
  onSubmit,
  successMessage
}) => {
  const [showFullForm, setShowFullForm] = useState(false);

  return (
    <form className="flex-1 w-full">
      <div className="flex-1 w-full">
        {/* Loan Request Summary Card */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between bg-green-50 border border-green-200 rounded-md p-4 shadow-sm gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Loan Request Summary</h2>
              <p className="text-gray-600">Review and confirm loan amount and term before applying</p>
            </div>
            <div className="text-center sm:text-right">
              <label className="block text-sm font-medium text-gray-700">Loan Amount</label>
              <div className="text-3xl font-bold text-green-600">
                ${formData.loan_amount || '0'}
              </div>
            </div>
          </div>
        </div>

        {/* Full Form Information - Responsive Layout */}
        <div className="mb-4">
          <div className="bg-white rounded-md p-4 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Application Snapshot</h2>
           
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm mt-2">
              {/* Personal */}
              <div className="space-y-1">
                <div className="font-semibold text-green-600 border-b border-green-100 pb-1 mb-1">Personal</div>
                <div><span className="text-gray-500">Name:</span> <span className="font-medium">{formData.firstname} {formData.last_name}</span></div>
                <div><span className="text-gray-500">Email:</span> <span>{formData.email}</span></div>
                <div><span className="text-gray-500">Phone:</span> <span>{formData.phone_number}</span></div>
                <div><span className="text-gray-500">DOB:</span> <span>{formData.dob}</span></div>
                <div><span className="text-gray-500">SSN:</span> <span>{formData.ssn}</span></div>
              </div>
              {/* Address */}
              <div className="space-y-1">
                <div className="font-semibold text-green-600 border-b border-green-100 pb-1 mb-1">Address</div>
                <div><span className="text-gray-500">Street:</span> <span>{formData.street_address}</span></div>
                <div><span className="text-gray-500">City:</span> <span>{formData.city}</span></div>
                <div><span className="text-gray-500">State:</span> <span>{formData.state}</span></div>
                <div><span className="text-gray-500">ZIP:</span> <span>{formData.zip_code}</span></div>
                <div><span className="text-gray-500">At Addr:</span> <span>{formData.months_at_address} mo</span></div>
                <div><span className="text-gray-500">Rent:</span> <span>${formData.monthly_rent}</span></div>
              </div>
              {/* Employment */}
              <div className="space-y-1">
                <div className="font-semibold text-green-600 border-b border-green-100 pb-1 mb-1">Employment</div>
                <div><span className="text-gray-500">Employer:</span> <span>{formData.employer_name}</span></div>
                <div><span className="text-gray-500">Months:</span> <span>{formData.months_at_employer}</span></div>
                <div><span className="text-gray-500">Source:</span> <span>{formData.income_source}</span></div>
                <div><span className="text-gray-500">Pay:</span> <span>{formData.pay_frequency}</span></div>
                <div><span className="text-gray-500">Income:</span> <span>${formData.monthly_income}</span></div>
              </div>
              {/* Loan */}
              <div className="space-y-1">
                <div className="font-semibold text-green-600 border-b border-green-100 pb-1 mb-1">Loan</div>
                <div><span className="text-gray-500">Amount:</span> <span className="font-bold text-green-700 text-base">${formData.loan_amount}</span></div>
                <div><span className="text-gray-500">Residence:</span> <span>{formData.residence_type}</span></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Validation Errors Display */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Please fix the following errors:</span>
            </div>
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(validationErrors).map(([field, message]) => (
                <li key={field} className="text-xs">
                  <span className="font-medium capitalize">{field.replace('_', ' ')}:</span> {message}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

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
        <div className="pt-[30px] border-gray-200 border-t-[1px] gap-1 flex flex-col sm:flex-row justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            className="w-full sm:w-auto"
          >
            Back
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Submitting Application..." : "View Pre-Qualified Offers"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SubmitOffersStep;