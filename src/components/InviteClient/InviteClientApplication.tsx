import React from 'react';
import { Input, Button } from '../index';
import { InviteClientFormData, InviteClientValidationErrors, validateInviteClient } from '../../validation';

interface InviteClientApplicationProps {
  formData: InviteClientFormData;
  validationErrors: InviteClientValidationErrors;
  error: string;
  onChange: (field: keyof InviteClientFormData, value: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const InviteClientApplication: React.FC<InviteClientApplicationProps> = ({
  formData,
  validationErrors,
  error,
  onChange,
  onSubmit,
  isSubmitting = false
}) => {
  // Validate form data using the schema
  const validationResult = validateInviteClient(formData);
  const isFormValid = validationResult.isValid;

  // Format loan amount input
  const formatLoanAmount = (value: string) => {
    const digits = value.replace(/\D/g, '');
    let num = parseInt(digits, 10);
    if (isNaN(num)) return '';
    if (num > 50000) num = 50000;
    return num.toString();
  };

  const handleLoanAmountChange = (value: string) => {
    const formattedValue = formatLoanAmount(value);
    onChange('loan_amount', formattedValue);
  };

  return (
    <form className="flex-1 w-full">
      <div className="flex-1 w-full">
        {/* Client Information - Responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={formData.client_email}
              onChange={(e) => onChange('client_email', e.target.value)}
              placeholder="client@example.com"
              className={validationErrors.client_email ? 'border-red-300 focus:border-red-500' : ''}
            />
            {validationErrors.client_email && (
              <p className="text-red-500 text-xs">{validationErrors.client_email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.first_name}
              onChange={(e) => onChange('first_name', e.target.value)}
              placeholder="First name"
              className={validationErrors.first_name ? 'border-red-300 focus:border-red-500' : ''}
            />
            {validationErrors.first_name && (
              <p className="text-red-500 text-xs">{validationErrors.first_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.last_name}
              onChange={(e) => onChange('last_name', e.target.value)}
              placeholder="Last name"
              className={validationErrors.last_name ? 'border-red-300 focus:border-red-500' : ''}
            />
            {validationErrors.last_name && (
              <p className="text-red-500 text-xs">{validationErrors.last_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
              <Input
                type="text"
                value={formData.loan_amount}
                onChange={(e) => handleLoanAmountChange(e.target.value)}
                placeholder="5000"
                className={`pl-8 ${validationErrors.loan_amount ? 'border-red-300 focus:border-red-500' : ''}`}
              />
            </div>
            {validationErrors.loan_amount && (
              <p className="text-red-500 text-xs">{validationErrors.loan_amount}</p>
            )}
          </div>

        </div>

        

        {/* Loan Amount and Reference - Responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.reference}
              onChange={(e) => onChange('reference', e.target.value)}
              placeholder="Reference"
              className={validationErrors.reference ? 'border-red-300 focus:border-red-500' : ''}
            />
            {validationErrors.reference && (
              <p className="text-red-500 text-xs">{validationErrors.reference}</p>
            )}
          </div>
        </div>

        {/* Subject Line */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject Line <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={formData.subject_line}
            onChange={(e) => onChange('subject_line', e.target.value)}
            placeholder="Request for Payment"
            className={validationErrors.subject_line ? 'border-red-300 focus:border-red-500' : ''}
          />
          {validationErrors.subject_line && (
            <p className="text-red-500 text-xs">{validationErrors.subject_line}</p>
          )}
        </div>

        {/* Custom Email Text */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Custom Email Text <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.custom_email_text}
            onChange={(e) => onChange('custom_email_text', e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-0 focus-within:ring-0 bg-white text-gray-700 resize-vertical ${
              validationErrors.custom_email_text ? 'border-red-300 focus:border-red-500' : 'border-gray-300'
            }`}
          />
          {validationErrors.custom_email_text && (
            <p className="text-red-500 text-xs">{validationErrors.custom_email_text}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Note: A secure, custom payment link will be embedded in the email message.
          </p>
          <p className="text-gray-500 text-xs">
            Tip: Customize the default subject line and email text in settings.
          </p>
        </div>

        {/* Attachment Section */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attachment <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
            {formData.selected_file ? (
              <div className="text-center">
                <svg className="mx-auto h-8 w-8 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-green-600 font-medium">{formData.selected_file}</p>
                <button 
                  type="button" 
                  onClick={() => onChange('selected_file', '')}
                  className="text-red-600 hover:text-red-500 text-xs mt-1"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div>
                <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-sm text-gray-600 mt-2">
                  <button 
                    type="button" 
                    onClick={() => onChange('selected_file', 'Case_REF12345.pdf')}
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Click to upload
                  </button> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
              </div>
            )}
          </div>
          {validationErrors.selected_file && (
            <p className="text-red-500 text-xs">{validationErrors.selected_file}</p>
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

        {/* Submit Button */}
        <div className="pt-[30px] border-gray-200 border-t-[1px] gap-1 flex justify-end">
          <Button
            type="button"
            variant="primary"
            onClick={onSubmit}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Sending Invite...' : 'Send Invite'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default InviteClientApplication;
