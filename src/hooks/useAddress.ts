import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { addressAPI, AddressValidationResponse } from '../api/address';

/**
 * Custom hook for address validation using ZIP code
 */
export const useAddressValidation = () => {
  const [isValidating, setIsValidating] = useState(false);

  // Address validation mutation
  const validateMutation = useMutation({
    mutationFn: addressAPI.validateAddress,
    onSuccess: (data) => {
      console.log('Address validated successfully:', data);
      setIsValidating(false);
    },
    onError: (error) => {
      console.error('Address validation failed:', error);
      setIsValidating(false);
    },
  });

  // Validate address function
  const validateAddress = useCallback(async (zipcode: string): Promise<AddressValidationResponse | null> => {
    if (!zipcode || zipcode.length < 5) {
      return null;
    }

    setIsValidating(true);
    
    try {
      const response = await validateMutation.mutateAsync(zipcode);
      return response;
    } catch (error) {
      console.error('Address validation error:', error);
      return null;
    }
  }, [validateMutation]);

  return {
    // State
    isValidating: isValidating || validateMutation.isPending,
    validationError: validateMutation.error,
    
    // Actions
    validateAddress,
  };
};
