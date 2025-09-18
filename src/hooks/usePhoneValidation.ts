import { useState, useCallback, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { phoneAPI, PhoneValidationResponse } from '../api/phone';

/**
 * Custom hook for phone number validation with debounce
 */
export const usePhoneValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Phone validation mutation
  const validateMutation = useMutation({
    mutationFn: phoneAPI.validatePhone,
    onSuccess: (data) => {
      console.log('Phone validated successfully:', data);
      setValidationStatus(data.valid ? 'valid' : 'invalid');
      setIsValidating(false);
    },
    onError: (error) => {
      console.error('Phone validation failed:', error);
      setValidationStatus('invalid');
      setIsValidating(false);
    },
  });

  // Immediate phone validation function (for manual button clicks)
  const validatePhoneImmediate = useCallback(async (phone: string): Promise<PhoneValidationResponse | null> => {
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Check if phone number has correct length (10 digits)
    const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
    if (cleanPhone.length !== 10) {
      setValidationStatus('idle');
      return null;
    }

    setIsValidating(true);
    setValidationStatus('idle');
    
    try {
      const response = await validateMutation.mutateAsync(cleanPhone);
      return response;
    } catch (error) {
      console.error('Phone validation error:', error);
      return null;
    }
  }, [validateMutation]);

  // Debounced phone validation function (for automatic validation)
  const validatePhone = useCallback(async (phone: string): Promise<PhoneValidationResponse | null> => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Reset validation status for new input
    setValidationStatus('idle');
    setIsValidating(false);

    // Check if phone number has correct length (10 digits)
    const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
    if (cleanPhone.length !== 10) {
      setValidationStatus('idle');
      return null;
    }

    // Set up debounced validation
    return new Promise((resolve) => {
      debounceTimeoutRef.current = setTimeout(async () => {
        setIsValidating(true);
        
        try {
          const response = await validateMutation.mutateAsync(cleanPhone);
          resolve(response);
        } catch (error) {
          console.error('Phone validation error:', error);
          resolve(null);
        }
      }, 500); // 500ms debounce delay
    });
  }, [validateMutation]);

  // Clear validation status when phone changes
  const resetValidation = useCallback(() => {
    setValidationStatus('idle');
    setIsValidating(false);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    isValidating: isValidating || validateMutation.isPending,
    validationStatus,
    validationError: validateMutation.error,
    
    // Actions
    validatePhone,
    validatePhoneImmediate,
    resetValidation,
  };
};
