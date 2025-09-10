import { useState, useCallback } from 'react';
import { ZodSchema, ZodError } from 'zod';
import { extractZodErrors } from '../utils';

/**
 * Custom hook for form validation using Zod
 * @param schema - Zod schema for validation
 * @returns Object with validation state and methods
 */
export const useFormValidation = <T extends Record<string, any>>(
  schema: ZodSchema<T>
) => {
  const [errors, setErrors] = useState<Partial<T>>({});

  /**
   * Validate form data against the schema
   * @param data - Form data to validate
   * @returns True if valid, false if invalid
   */
  const validate = useCallback((data: T): boolean => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      const validationErrors = extractZodErrors<T>(error);
      setErrors(validationErrors);
      return false;
    }
  }, [schema]);

  /**
   * Clear specific field error
   * @param field - Field name to clear error for
   */
  const clearFieldError = useCallback((field: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  /**
   * Clear all errors
   */
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Set a specific field error
   * @param field - Field name
   * @param message - Error message
   */
  const setFieldError = useCallback((field: keyof T, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: message,
    }));
  }, []);

  /**
   * Check if a specific field has an error
   * @param field - Field name to check
   * @returns True if field has error
   */
  const hasFieldError = useCallback((field: keyof T): boolean => {
    return field in errors && errors[field] !== undefined;
  }, [errors]);

  /**
   * Get error message for a specific field
   * @param field - Field name
   * @returns Error message or undefined
   */
  const getFieldError = useCallback((field: keyof T): string | undefined => {
    return errors[field] as string | undefined;
  }, [errors]);

  return {
    errors,
    validate,
    clearFieldError,
    clearAllErrors,
    setFieldError,
    hasFieldError,
    getFieldError,
  };
};
