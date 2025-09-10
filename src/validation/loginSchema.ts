import { z } from 'zod';

// Login form validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  userType: z.string().refine(
    (val) => val === 'client' || val === 'attorney',
    { message: 'Please select Client or Attorney' }
  ),
});

// Type inference from schema
export type LoginFormData = z.infer<typeof loginSchema>;

// Validation error type
export type LoginValidationErrors = {
  email?: string;
  password?: string;
  userType?: string;
};
