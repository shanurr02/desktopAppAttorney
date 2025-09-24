import React, { useState, useCallback, useEffect, useRef } from 'react';
import { z } from 'zod';
import debounce from 'lodash.debounce';
import { Input, Button } from '../index';
import { PersonalDetailsData, PersonalDetailsValidationErrors, validatePersonalDetails } from '../../validation';
import DateSelector from '../Dashboard/DateSelector';
import { useAddressValidation, usePhoneValidation } from '../../hooks';

interface PersonalDetailsStepProps {
  formData: PersonalDetailsData;
  validationErrors: PersonalDetailsValidationErrors;
  error: string;
  onFirstNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLastNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDobChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDobDateSelect: (startDate: Date | null, endDate: Date | null) => void;
  onSsnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStreetAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onMonthsAtAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMonthlyRentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onZipCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPrevious: () => void;
  onNext: () => void;
  clearFieldError?: (field: keyof PersonalDetailsValidationErrors) => void;
}

const PersonalDetailsStep: React.FC<PersonalDetailsStepProps> = ({
  formData,
  validationErrors,
  error,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onDobChange,
  onDobDateSelect,
  onSsnChange,
  onStreetAddressChange,
  onCityChange,
  onStateChange,
  onMonthsAtAddressChange,
  onMonthlyRentChange,
  onZipCodeChange,
  onPhoneNumberChange,
  onPrevious,
  onNext, 
  clearFieldError
}) => {
  const { validateAddress, isValidating } = useAddressValidation();
  const { validatePhoneImmediate, isValidating: isPhoneValidating, validationStatus: phoneValidationStatus } = usePhoneValidation();
  const [isStateDropdownDisabled, setIsStateDropdownDisabled] = useState(true);
  const [zipValidationStatus, setZipValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [emailError, setEmailError] = useState<string>('');

  // Store callback functions in refs to avoid dependency issues
  const onCityChangeRef = useRef(onCityChange);
  const onStateChangeRef = useRef(onStateChange);
  
  // Update refs when callbacks change
  useEffect(() => {
    onCityChangeRef.current = onCityChange;
    onStateChangeRef.current = onStateChange;
  }, [onCityChange, onStateChange]);

  // Phone validation function
  const validatePhoneNumber = useCallback(async (phone: string) => {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    
    if (phone.length === 0) {
      return;
    }

    // Only validate if format is correct
    if (!phoneRegex.test(phone)) {
      return;
    }

    try {
      await validatePhoneImmediate(phone);
    } catch (error) {
      console.error('Phone validation error:', error);
    }
  }, [validatePhoneImmediate]);

  // ZIP validation function
  const validateZipCode = useCallback(async (zipCode: string) => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    
    if (zipCode.length === 0) {
      setZipValidationStatus('idle');
      setIsStateDropdownDisabled(true);
      return;
    }

    if (!zipRegex.test(zipCode)) {
      setZipValidationStatus('invalid');
      setIsStateDropdownDisabled(false);
      return;
    }

    try {
      const addressData = await validateAddress(zipCode);
      if (addressData && addressData.city && addressData.state) {
        // Create synthetic events to update city and state
        const cityEvent = {
          target: { value: addressData.city }
        } as React.ChangeEvent<HTMLInputElement>;
        
        const stateEvent = {
          target: { value: addressData.state }
        } as React.ChangeEvent<HTMLSelectElement>;
        
        onCityChangeRef.current(cityEvent);
        onStateChangeRef.current(stateEvent);
        
        setIsStateDropdownDisabled(true);
        setZipValidationStatus('valid');
      } else {
        setIsStateDropdownDisabled(false);
        setZipValidationStatus('invalid');
      }
    } catch (error: any) {
      console.error('Address validation error:', error);
      setIsStateDropdownDisabled(false);
      setZipValidationStatus('invalid');
      
      // Clear city and state fields when ZIP is invalid
      const clearCityEvent = {
        target: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>;
      
      const clearStateEvent = {
        target: { value: '' }
      } as React.ChangeEvent<HTMLSelectElement>;
      
      onCityChangeRef.current(clearCityEvent);
      onStateChangeRef.current(clearStateEvent);
    }
  }, [validateAddress]);

  // Create debounced functions using lodash
  const debouncedPhoneValidation = useRef(
    debounce((phone: string) => {
      validatePhoneNumber(phone);
    }, 500)
  ).current;

  const debouncedZipValidation = useRef(
    debounce((zipCode: string) => {
      validateZipCode(zipCode);
    }, 500)
  ).current;

  // Phone validation effect
  useEffect(() => {
    debouncedPhoneValidation(formData.phone_number);
  }, [formData.phone_number, debouncedPhoneValidation]);

  // ZIP validation effect
  useEffect(() => {
    debouncedZipValidation(formData.zip_code);
  }, [formData.zip_code, debouncedZipValidation]);

  // Cleanup debounced functions on unmount
  useEffect(() => {
    return () => {
      debouncedPhoneValidation.cancel();
      debouncedZipValidation.cancel();
    };
  }, [debouncedPhoneValidation, debouncedZipValidation]);

  // Email validation function
  const validateEmail = useCallback((email: string) => {
    try {
      // Create a simple email validation schema
      const emailSchema = z.string().min(1, 'Email is required').email('Please enter a valid email address');
      emailSchema.parse(email);
      setEmailError('');
      if (clearFieldError) {
        clearFieldError('email');
      }
    } catch (error: any) {
      if (error.errors && error.errors[0]) {
        setEmailError(error.errors[0].message);
      }
    }
  }, [clearFieldError]);

  // Handle email change with validation
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onEmailChange(e);
    const email = e.target.value;
    if (email.trim()) {
      validateEmail(email);
    } else {
      setEmailError('');
      if (clearFieldError) {
        clearFieldError('email');
      }
    }
  }, [onEmailChange, validateEmail, clearFieldError]); 

  const stateOptions = [
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" },
    { value: "AS", label: "American Samoa" },
    { value: "GU", label: "Guam" },
    { value: "MP", label: "Northern Mariana Islands" },
    { value: "PR", label: "Puerto Rico" },
    { value: "VI", label: "U.S. Virgin Islands" },
    { value: "DC", label: "District of Columbia (Washington, D.C.)" },
  ];

  // Validate form data using the schema
  const validationResult = validatePersonalDetails(formData);
  
  // Debug: Log validation result to see what's failing
  console.log('Validation result:', validationResult);
  console.log('Phone validation status:', phoneValidationStatus);
  console.log('Email error:', emailError);
  
  // Form is valid if schema validation passes AND phone/email are valid
  const isFormValid = validationResult.isValid && 
    // Phone validation: valid OR empty
    (phoneValidationStatus === 'valid' || formData.phone_number.length === 0) &&
    // Email validation: no error OR empty
    (!emailError || formData.email.length === 0);

  return (
    <form className="flex-1 w-full">
      <div className="flex-1 w-full">
        {/* Personal Information - Responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
            <Input
              type="text"
              value={formData.firstname}
              onChange={onFirstNameChange}
              placeholder="First name"
              className={validationErrors.firstname ? 'border-red-300 focus:border-red-500' : ''}
            />
            {validationErrors.firstname && (
              <p className="text-red-500 text-xs">{validationErrors.firstname}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
            <Input
              type="text"
              value={formData.last_name}
              onChange={onLastNameChange}
              placeholder="Last name"
              className={validationErrors.last_name ? 'border-red-300 focus:border-red-500' : ''}
            />
            {validationErrors.last_name && (
              <p className="text-red-500 text-xs">{validationErrors.last_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
            <Input
              type="email"
              value={formData.email}
              onChange={handleEmailChange}
              placeholder="Email"
              autoComplete="email"
              className={(validationErrors.email || emailError) ? 'border-red-300 focus:border-red-500' : ''}
            />
            {(validationErrors.email || emailError) && (
              <p className="text-red-500 text-xs">{validationErrors.email || emailError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="text"
                value={formData.phone_number}
                onChange={onPhoneNumberChange}
                placeholder="(XXX) XXX-XXXX"
                maxLength={14}
                className={`w-full px-3 py-2 border max-h-[40px] rounded-md focus:outline-none focus:ring-0 focus-within:ring-0 ${
                  validationErrors.phone_number 
                    ? 'border-red-300 focus:border-red-500' 
                    : phoneValidationStatus === 'valid'
                    ? 'border-green-300 focus:border-green-500'
                    : phoneValidationStatus === 'invalid'
                    ? 'border-orange-300 focus:border-orange-500'
                    : 'border-gray-300'
                }`}
              />
              {isPhoneValidating && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                </div>
              )}
              {phoneValidationStatus === 'valid' && !isPhoneValidating && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              {phoneValidationStatus === 'invalid' && !isPhoneValidating && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {validationErrors.phone_number && (
              <p className="text-red-500 text-xs">{validationErrors.phone_number}</p>
            )}
            {phoneValidationStatus === 'invalid' && !validationErrors.phone_number && (
              <p className="text-orange-500 text-xs">
                Invalid phone number. 
              </p>
            )}
            {phoneValidationStatus === 'valid' && !validationErrors.phone_number && (
              <p className="text-green-600 text-xs">
                Valid phone number.
              </p>
            )}
          </div>
        </div>

        {/* DOB and SSN - Responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
            <DateSelector
              label="Select date of birth"
              onDateSelect={onDobDateSelect}
              singleDate={true}
              value={formData.dob}
              className={`w-full px-3 py-2 border max-h-[40px] rounded-md focus:outline-none focus:ring-0 focus-within:ring-0 ${validationErrors.dob ? 'border-red-300 focus:border-red-500' : 'border-gray-300'}`}
            />
            {validationErrors.dob && (
              <p className="text-red-500 text-xs">{validationErrors.dob}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"> Social Security Number (SSN) <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.ssn}
              onChange={onSsnChange}
              placeholder="XXX-XX-XXXX"
              maxLength={11}
              className={`w-full px-3 py-2 border max-h-[40px] rounded-md focus:outline-none  transition-all duration-200 focus:ring-2 focus:ring-green-50 focus:border-green-500  ${validationErrors.ssn ? 'border-red-300 focus:border-red-500' : 'border-gray-300'}`}        
            />
            {validationErrors.ssn && (
              <p className="text-red-500 text-xs">{validationErrors.ssn}</p>
            )}
          </div>
        </div>

        {/* Address Section Header */}
        <div>
          <label className="block text-gray-700 font-medium py-2">Address Information</label>
        </div>

        {/* Street Address */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address <span className="text-red-500">*</span></label>
          <Input
            type="text"
            value={formData.street_address}
            onChange={onStreetAddressChange}
            placeholder="Enter street address"
            className={validationErrors.street_address ? 'border-red-300 focus:border-red-500' : ''}
          />
          {validationErrors.street_address && (
            <p className="text-red-500 text-xs">{validationErrors.street_address}</p>
          )}
        </div>

        {/* City, State, ZIP - Responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="text"
                value={formData.zip_code}
                onChange={onZipCodeChange}
                placeholder="ZIP"
                maxLength={5}
                className={`w-full px-3 py-2 border max-h-[40px] rounded-md focus:outline-none focus:ring-0 focus-within:ring-0 ${
                  validationErrors.zip_code 
                    ? 'border-red-300 focus:border-red-500' 
                    : zipValidationStatus === 'valid'
                    ? 'border-green-300 focus:border-green-500'
                    : zipValidationStatus === 'invalid'
                    ? 'border-orange-300 focus:border-orange-500'
                    : 'border-gray-300'
                }`}
              />
              {isValidating && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                </div>
              )}
              {zipValidationStatus === 'valid' && !isValidating && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              {zipValidationStatus === 'invalid' && !isValidating && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {validationErrors.zip_code && (
              <p className="text-red-500 text-xs">{validationErrors.zip_code}</p>
            )}
            {zipValidationStatus === 'invalid' && !validationErrors.zip_code && (
              <p className="text-orange-500 text-xs">
                Invalid ZIP code format. 
              </p>
            )}
            {zipValidationStatus === 'valid' && !validationErrors.zip_code && (
              <p className="text-green-600 text-xs">
                Valid ZIP code. City and state auto-filled.
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
              {isStateDropdownDisabled && (
                <span className="text-xs text-gray-400 ml-1">(Auto-filled)</span>
              )}
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={onCityChange}
              placeholder="City"
              // disabled={isStateDropdownDisabled}
              className={`w-full px-3 py-2 border max-h-[40px] rounded-md focus:outline-none focus:ring-0 focus-within:ring-0 ${
                isStateDropdownDisabled 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700'
              } ${validationErrors.city ? 'border-red-300 focus:border-red-500' : 'border-gray-300'}`}
            />
            {validationErrors.city && (
              <p className="text-red-500 text-xs">{validationErrors.city}</p>
            )}
            {isStateDropdownDisabled && (
              <p className="text-xs text-gray-400 mt-1">
                City will be automatically filled from ZIP code
              </p>
            )}
          </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               State <span className="text-red-500">*</span>
               {isStateDropdownDisabled && (
                 <span className="text-xs text-gray-400 ml-1">(Auto-filled)</span>
               )}
             </label>
             <select
               value={formData.state}
               onChange={onStateChange}
              //  dis abled={isStateDropdownDisabled}
               className={`w-full px-3 py-2 border max-h-[40px] rounded-md focus:outline-none focus:ring-0 focus-within:ring-0 ${
                 isStateDropdownDisabled 
                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                   : 'bg-white text-gray-500'
               } ${validationErrors.state ? 'border-red-300 focus:border-red-500' : 'border-gray-300'}`}
             >
               <option value="">State</option>
               {stateOptions.map((state) => (
                 <option key={state.value} value={state.value}>
                   {state.label}
                 </option>
               ))}
             </select>
             {isStateDropdownDisabled && (
               <p className="text-xs text-gray-400 mt-1">
                 State will be automatically filled from ZIP code
               </p>
             )}
           </div>

         
        </div>

        {/* Months at Address and Monthly Rent - Responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Months at Address <span className="text-red-500">*</span></label>
            <Input
              type="text"
              value={formData.months_at_address}
              onChange={onMonthsAtAddressChange}
              placeholder="Months"
              className={validationErrors.months_at_address ? 'border-red-300 focus:border-red-500' : ''}
            />
            {validationErrors.months_at_address && (
              <p className="text-red-500 text-xs">{validationErrors.months_at_address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent <span className="text-red-500">*</span></label>
            <Input
              type="text"
              value={formData.monthly_rent}
              onChange={onMonthlyRentChange}
              placeholder="Monthly rent"
              className={validationErrors.monthly_rent ? 'border-red-300 focus:border-red-500' : ''}
            />
            {validationErrors.monthly_rent && (
              <p className="text-red-500 text-xs">{validationErrors.monthly_rent}</p>
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

export default PersonalDetailsStep;