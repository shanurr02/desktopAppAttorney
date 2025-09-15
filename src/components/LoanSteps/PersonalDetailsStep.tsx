import React, { useState, useCallback } from 'react';
import { Input, Button } from '../index';
import { LoanFormData, LoanValidationErrors } from '../../validation';
import DateSelector from '../Dashboard/DateSelector';
import { useAddressValidation } from '../../hooks';

interface PersonalDetailsStepProps {
  formData: LoanFormData;
  validationErrors: LoanValidationErrors;
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
}

const PersonalDetailsStep: React.FC<PersonalDetailsStepProps> = ({
  formData,
  validationErrors,
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
  onNext
}) => {
  const { validateAddress, isValidating } = useAddressValidation();
  const [isStateDropdownDisabled, setIsStateDropdownDisabled] = useState(true);

  // Handle ZIP code validation button click
  const handleValidateZipCode = useCallback(async () => {
    const zipCode = formData.zip_code;
    
    if (!zipCode || zipCode.length !== 5) {
      return;
    }

    try {
      const addressData = await validateAddress(zipCode);
      if (addressData) {
        // Create synthetic events to update city and state
        const cityEvent = {
          target: { value: addressData.city }
        } as React.ChangeEvent<HTMLInputElement>;
        
        const stateEvent = {
          target: { value: addressData.state }
        } as React.ChangeEvent<HTMLSelectElement>;
        
        onCityChange(cityEvent);
        onStateChange(stateEvent);
        
        // Keep state dropdown disabled since we got valid data
        setIsStateDropdownDisabled(true);
      }
    } catch (error: any) {
      console.error('Address validation error:', error);
      
      // Check if it's a 500 error - enable dropdown for manual selection
      if (error?.response?.status === 500) {
        setIsStateDropdownDisabled(false);
      }
    }
  }, [formData.zip_code, validateAddress, onCityChange, onStateChange]);
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

  const isFormValid = formData.firstname && formData.last_name && formData.email &&
    formData.dob && formData.ssn && formData.phone_number &&
    formData.street_address && formData.city && formData.state && formData.zip_code;

  return (
    <form className="flex-1 w-full">
      <div className="flex-1 w-full">
        {/* Personal Information - Responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={onEmailChange}
              placeholder="Email"
              autoComplete="email"
              className={validationErrors.email ? 'border-red-300 focus:border-red-500' : ''}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              value={formData.phone_number}
              onChange={onPhoneNumberChange}
              placeholder="(XXX) XXX-XXXX"
              maxLength={14}
              className={`w-full px-3 py-2 border max-h-[40px] rounded-md focus:outline-none  transition-all duration-200 focus:ring-2 focus:ring-green-50 focus:border-green-500  ${validationErrors.phone_number ? 'border-red-300 focus:border-red-500' : 'border-gray-300'}`}
            />
            {validationErrors.phone_number && (
              <p className="text-red-500 text-xs">{validationErrors.phone_number}</p>
            )}
          </div>
        </div>

        {/* DOB and SSN - Responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <DateSelector
              label="Select date of birth"
              onDateSelect={onDobDateSelect}
              singleDate={true}
              className={`w-full px-3 py-2 border max-h-[40px] rounded-md focus:outline-none focus:ring-0 focus-within:ring-0 ${validationErrors.dob ? 'border-red-300 focus:border-red-500' : 'border-gray-300'}`}
            />
            {validationErrors.dob && (
              <p className="text-red-500 text-xs">{validationErrors.dob}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SSN</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
              {isStateDropdownDisabled && (
                <span className="text-xs text-green-600 ml-1">(Auto-filled)</span>
              )}
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={onCityChange}
              placeholder="City"
              disabled={isStateDropdownDisabled}
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
              <p className="text-xs text-green-600 mt-1">
                City will be automatically filled from ZIP code
              </p>
            )}
          </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               State
               {isStateDropdownDisabled && (
                 <span className="text-xs text-green-600 ml-1">(Auto-filled)</span>
               )}
             </label>
             <select
               value={formData.state}
               onChange={onStateChange}
               disabled={isStateDropdownDisabled}
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
               <p className="text-xs text-green-600 mt-1">
                 State will be automatically filled from ZIP code
               </p>
             )}
           </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={formData.zip_code}
                  onChange={onZipCodeChange}
                  placeholder="ZIP"
                  maxLength={5}
                  className={`w-full px-3 py-2 border max-h-[40px] rounded-md focus:outline-none focus:ring-0 focus-within:ring-0 ${validationErrors.zip_code ? 'border-red-300 focus:border-red-500' : 'border-gray-300'}`}
                />
                {isValidating && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleValidateZipCode}
                disabled={!formData.zip_code || formData.zip_code.length !== 5 || isValidating}
                className="px-4 py-2 text-sm whitespace-nowrap"
              >
                {isValidating ? 'Checking...' : 'Check ZIP'}
              </Button>
            </div>
            {validationErrors.zip_code && (
              <p className="text-red-500 text-xs">{validationErrors.zip_code}</p>
            )}
          </div>
        </div>

        {/* Months at Address and Monthly Rent - Responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Months at Address</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent</label>
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