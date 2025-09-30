import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { loanAPI, LoanApplicationRequest } from '../api/loan';
import { LoanFormData, loanSchema, LoanValidationErrors } from '../validation/loanSchema';
import { useFormValidation } from './useFormValidation';

/**
 * Custom hook for loan application form management
 */
export const useLoanForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use form validation hook
  const {
    errors: validationErrors,
    validate,
    clearFieldError,
    clearAllErrors,
  } = useFormValidation<LoanValidationErrors>(loanSchema);

  // Process application mutation (get session_id)
  const processMutation = useMutation({
    mutationFn: loanAPI.processApplication,
    onSuccess: (data) => {
      console.log('Session ID obtained successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to get session ID:', error);
      setIsSubmitting(false);
    },
  });

  // Submit loan application mutation
  const submitMutation = useMutation({
    mutationFn: loanAPI.submitApplication,
    onSuccess: (data) => {
      console.log('Loan application submitted successfully:', data);
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error('Loan application submission failed:', error);
      setIsSubmitting(false);
    },
  });

  // Submit form function
  const submitApplication = useCallback(async (formData: LoanFormData) => {
    setIsSubmitting(true);
    clearAllErrors();

    // Validate form data
    if (!validate(formData)) {
      setIsSubmitting(false);
      // Get detailed validation errors
      const errors = loanSchema.safeParse(formData);
      if (!errors.success) {
        console.error('Validation errors:', errors.error.issues);
        const errorMessages = errors.error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }
      throw new Error("Please fill in all required fields correctly.");
    }

    try {
      // Get auth token from localStorage
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        throw new Error("Authentication token not found. Please login again.");
      }

      // Step 1: Get session_id from process_application endpoint
      const processResponse = await processMutation.mutateAsync(authToken);
      const sessionId = processResponse.session_id;

      // Step 2: Submit application with session_id
      const applicationData: LoanApplicationRequest = {
        ...formData,
        session_id: sessionId
      };
      
      const response = await submitMutation.mutateAsync(applicationData);
      return response;
    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
      throw error; // Re-throw the error so it can be caught in the component
    }
  }, [validate, clearAllErrors, processMutation, submitMutation]);

  // Clear field error function
  const clearField = useCallback((field: keyof LoanValidationErrors) => {
    clearFieldError(field);
  }, [clearFieldError]);

  return {
    // State
    isSubmitting,
    isLoading: processMutation.isPending || submitMutation.isPending,
    validationErrors,
    submitError: processMutation.error || submitMutation.error,
    
    // Actions
    submitApplication,
    clearField,
    clearAllErrors,
  };
};
