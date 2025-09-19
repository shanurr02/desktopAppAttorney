import { z } from 'zod';
import { completeLoanSchema } from './loanStepSchemas';

// Main loan schema - now uses the combined schema from step schemas
export const loanSchema = completeLoanSchema;

// Type inference from schema (without session_id since it comes from API)
export type LoanFormData = z.infer<typeof loanSchema>;

// Extended type for API submission (includes session_id)
export type LoanFormDataWithSession = LoanFormData & {
  session_id: string;
};

// Validation error type - now uses the combined type from step schemas
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
