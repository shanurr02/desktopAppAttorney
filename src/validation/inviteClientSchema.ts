import { z } from 'zod';

// Invite Client Form Schema
export const inviteClientSchema = z.object({
  client_email: z.string()
    .min(1, 'Client email is required')
    .email('Please enter a valid email address'),
  first_name: z.string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  last_name: z.string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  attorney_email: z.string()
    .min(1, 'Attorney email is required')
    .email('Please enter a valid attorney email address'),
  loan_amount: z.string()
    .min(1, 'Loan amount is required')
    .regex(/^\d+$/, 'Loan amount must be a valid number')
    .refine((val) => parseInt(val) >= 1000, 'Minimum loan amount is $1,000')
    .refine((val) => parseInt(val) <= 50000, 'Maximum loan amount is $50,000'),
  reference: z.string()
    .min(1, 'Reference is required')
    .max(100, 'Reference must be less than 100 characters'),
  subject_line: z.string()
    .min(1, 'Subject line is required')
    .min(5, 'Subject line must be at least 5 characters')
    .max(100, 'Subject line must be less than 100 characters'),
  custom_email_text: z.string()
    .min(1, 'Custom email text is required')
    .min(10, 'Custom email text must be at least 10 characters')
    .max(1000, 'Custom email text must be less than 1000 characters'),
  selected_file: z.string()
    .min(1, 'File selection is required')
    .max(255, 'File name must be less than 255 characters'),
});

// Type inference from schema
export type InviteClientFormData = z.infer<typeof inviteClientSchema>;

// Validation error type
export type InviteClientValidationErrors = {
  client_email?: string;
  first_name?: string;
  last_name?: string;
  attorney_email?: string;
  loan_amount?: string;
  reference?: string;
  subject_line?: string;
  custom_email_text?: string;
  selected_file?: string;
};

// Validation function
export const validateInviteClient = (data: InviteClientFormData) => {
  try {
    inviteClientSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: InviteClientValidationErrors = {};
      error.issues.forEach((err: z.ZodIssue) => {
        const field = err.path[0] as keyof InviteClientValidationErrors;
        errors[field] = err.message;
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { client_email: 'Validation failed' } };
  }
};
