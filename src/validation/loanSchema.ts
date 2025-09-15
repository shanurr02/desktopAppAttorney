import { z } from 'zod';

// Loan application form validation schema
export const loanSchema = z.object({
  loan_amount: z.string()
    .min(1, 'Loan amount is required')
    .regex(/^\d+$/, 'Loan amount must be a number')
    .refine((val) => {
      const num = parseInt(val);
      return num >= 1 && num <= 1000;
    }, 'Loan amount must be between $1 and $1000'),
  residence_type: z.string().min(1, 'Residence type is required'),
  next_page: z.string().optional(),
  firstname: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  dob: z.string().min(1, 'Date of birth is required').regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in MM/DD/YYYY format'),
  ssn: z.string().min(1, 'SSN is required').regex(/^\d{3}-\d{2}-\d{4}$/, 'SSN must be in XXX-XX-XXXX format'),
  street_address: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required').length(2, 'State must be 2 characters'),
  months_at_address: z.string().min(1, 'Months at address is required').regex(/^\d+$/, 'Must be a number'),
  monthly_rent: z.string().min(1, 'Monthly rent is required').regex(/^\d+$/, 'Monthly rent must be a number'),
  zip_code: z.string().min(1, 'Zip code is required').regex(/^\d{5}(-\d{4})?$/, 'Invalid zip code format'),
  phone_number: z.string().min(1, 'Phone number is required').regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone must be in (XXX) XXX-XXXX format'),
  income_source: z.string().min(1, 'Income source is required'),
  pay_frequency: z.string().min(1, 'Pay frequency is required'),
  monthly_income: z.string().min(1, 'Monthly income is required').regex(/^\d+$/, 'Monthly income must be a number'),
  months_at_employer: z.string().min(1, 'Months at employer is required').regex(/^\d+$/, 'Must be a number'),
  employer_name: z.string().min(1, 'Employer name is required'),
});

// Type inference from schema (without session_id since it comes from API)
export type LoanFormData = z.infer<typeof loanSchema>;

// Extended type for API submission (includes session_id)
export type LoanFormDataWithSession = LoanFormData & {
  session_id: string;
};

// Validation error type
export type LoanValidationErrors = {
  loan_amount?: string;
  residence_type?: string;
  next_page?: string;
  firstname?: string;
  last_name?: string;
  email?: string;
  dob?: string;
  ssn?: string;
  street_address?: string;
  city?: string;
  state?: string;
  months_at_address?: string;
  monthly_rent?: string;
  zip_code?: string;
  phone_number?: string;
  income_source?: string;
  pay_frequency?: string;
  monthly_income?: string;
  months_at_employer?: string;
  employer_name?: string;
};
