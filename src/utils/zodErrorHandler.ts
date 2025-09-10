import { ZodError } from 'zod';

/**
 * Helper function to extract field-specific errors from Zod validation errors
 * @param error - ZodError or any error object
 * @returns Object with field names as keys and error messages as values
 */
export const extractZodErrors = <T extends Record<string, any>>(
  error: unknown
): Partial<T> => {
  const errors: Partial<T> = {};

  if (error instanceof ZodError) {
    error.issues.forEach((issue) => {
      const fieldName = issue.path[0] as keyof T;
      if (fieldName) {
        errors[fieldName] = issue.message as T[keyof T];
      }
    });
  }

  return errors;
};

/**
 * Helper function to get the first error message from Zod validation
 * @param error - ZodError or any error object
 * @returns First error message or null
 */
export const getFirstZodError = (error: unknown): string | null => {
  if (error instanceof ZodError && error.issues.length > 0) {
    return error.issues[0].message;
  }
  return null;
};

/**
 * Helper function to check if an error is a Zod validation error
 * @param error - Any error object
 * @returns True if it's a ZodError
 */
export const isZodError = (error: unknown): error is ZodError => {
  return error instanceof ZodError;
};

/**
 * Helper function to format Zod errors for display
 * @param error - ZodError or any error object
 * @returns Formatted error messages
 */
export const formatZodErrors = (error: unknown): string[] => {
  if (error instanceof ZodError) {
    return error.issues.map((issue) => {
      const field = issue.path.join('.');
      return field ? `${field}: ${issue.message}` : issue.message;
    });
  }
  return [];
};
