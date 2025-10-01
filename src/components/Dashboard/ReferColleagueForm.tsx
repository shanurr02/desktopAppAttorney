import React from 'react';
import { Input, Button } from '../index';

interface ReferColleagueFormData {
  colleague_first_name: string;
  colleague_last_name: string;
  colleague_firm_name: string;
  colleague_email: string;
  colleague_firm_size: string;
  colleague_phone: string;
  colleague_message: string;
  your_name: string;
  your_email: string;
}

interface ReferColleagueValidationErrors {
  colleague_first_name?: string;
  colleague_last_name?: string;
  colleague_firm_name?: string;
  colleague_email?: string;
  colleague_firm_size?: string;
  colleague_phone?: string;
  colleague_message?: string;
  your_name?: string;
  your_email?: string;
}

interface ReferColleagueFormProps {
  formData: ReferColleagueFormData;
  validationErrors: ReferColleagueValidationErrors;
  error: string;
  onChange: (field: keyof ReferColleagueFormData, value: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const ReferColleagueForm: React.FC<ReferColleagueFormProps> = ({
  formData,
  validationErrors,
  error,
  onChange,
  onSubmit,
  isSubmitting = false
}) => {
  // Basic validation
  const isFormValid = 
    formData.colleague_first_name.trim() !== '' &&
    formData.colleague_last_name.trim() !== '' &&
    formData.colleague_firm_name.trim() !== '' &&
    formData.colleague_email.trim() !== '' &&
    formData.colleague_firm_size.trim() !== '' &&
    formData.colleague_phone.trim() !== '' &&
    formData.colleague_message.trim() !== '' &&
    formData.your_name.trim() !== '' &&
    formData.your_email.trim() !== '';

  return (
    <div className="flex-1 w-full">
      <form className="flex-1 w-full">
        <div className="flex-1 w-full">
          {/* Colleague Information - Responsive columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Colleague First Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.colleague_first_name}
                onChange={(e) => onChange('colleague_first_name', e.target.value)}
                placeholder="First name"
                className={validationErrors.colleague_first_name ? 'border-red-300 focus:border-red-500' : ''}
              />
              {validationErrors.colleague_first_name && (
                <p className="text-red-500 text-xs">{validationErrors.colleague_first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Colleague Last Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.colleague_last_name}
                onChange={(e) => onChange('colleague_last_name', e.target.value)}
                placeholder="Last name"
                className={validationErrors.colleague_last_name ? 'border-red-300 focus:border-red-500' : ''}
              />
              {validationErrors.colleague_last_name && (
                <p className="text-red-500 text-xs">{validationErrors.colleague_last_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Colleague Firm Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.colleague_firm_name}
                onChange={(e) => onChange('colleague_firm_name', e.target.value)}
                placeholder="Firm name"
                className={validationErrors.colleague_firm_name ? 'border-red-300 focus:border-red-500' : ''}
              />
              {validationErrors.colleague_firm_name && (
                <p className="text-red-500 text-xs">{validationErrors.colleague_firm_name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Colleague Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={formData.colleague_email}
                onChange={(e) => onChange('colleague_email', e.target.value)}
                placeholder="colleague@example.com"
                className={validationErrors.colleague_email ? 'border-red-300 focus:border-red-500' : ''}
              />
              {validationErrors.colleague_email && (
                <p className="text-red-500 text-xs">{validationErrors.colleague_email}</p>
              )}
            </div>
          </div>

          {/* Contact Information - Responsive columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Colleague Firm Size <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.colleague_firm_size}
                onChange={(e) => onChange('colleague_firm_size', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-0 focus-within:ring-0 bg-white text-gray-700 ${
                  validationErrors.colleague_firm_size ? 'border-red-300 focus:border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select firm size</option>
                <option value="1-5">1-5 attorneys</option>
                <option value="6-20">6-20 attorneys</option>
                <option value="21-50">21-50 attorneys</option>
                <option value="51-100">51-100 attorneys</option>
                <option value="100+">100+ attorneys</option>
              </select>
              {validationErrors.colleague_firm_size && (
                <p className="text-red-500 text-xs">{validationErrors.colleague_firm_size}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Colleague Phone <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                value={formData.colleague_phone}
                onChange={(e) => onChange('colleague_phone', e.target.value)}
                placeholder="(555) 123-4567"
                className={validationErrors.colleague_phone ? 'border-red-300 focus:border-red-500' : ''}
              />
              {validationErrors.colleague_phone && (
                <p className="text-red-500 text-xs">{validationErrors.colleague_phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.your_name}
                onChange={(e) => onChange('your_name', e.target.value)}
                placeholder="Your name"
                className={validationErrors.your_name ? 'border-red-300 focus:border-red-500' : ''}
              />
              {validationErrors.your_name && (
                <p className="text-red-500 text-xs">{validationErrors.your_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={formData.your_email}
                onChange={(e) => onChange('your_email', e.target.value)}
                placeholder="your@example.com"
                className={validationErrors.your_email ? 'border-red-300 focus:border-red-500' : ''}
              />
              {validationErrors.your_email && (
                <p className="text-red-500 text-xs">{validationErrors.your_email}</p>
              )}
            </div>
          </div>
          {/* Message */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Colleague Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.colleague_message}
              onChange={(e) => onChange('colleague_message', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-0 focus-within:ring-0 bg-white text-gray-700 resize-vertical ${
                validationErrors.colleague_message ? 'border-red-300 focus:border-red-500' : 'border-gray-300'
              }`}
              placeholder="Tell us why you're recommending LawPay to your colleague..."
            />
            {validationErrors.colleague_message && (
              <p className="text-red-500 text-xs">{validationErrors.colleague_message}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Share why you think LawPay would be a great fit for your colleague's practice.
            </p>
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
              {isSubmitting ? 'Sending Referral...' : 'Send Referral'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReferColleagueForm;
