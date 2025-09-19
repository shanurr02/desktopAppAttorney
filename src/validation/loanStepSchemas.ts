import { z } from 'zod';

// Step 1: Loan Request Schema
export const loanRequestSchema = z.object({
  loan_amount: z.string()
    .min(1, 'Loan amount is required')
    .regex(/^\d+$/, 'Loan amount must be a number')
    .refine((val) => {
      const num = parseInt(val);
      return num >= 1 && num <= 50000;
    }, 'Loan amount must be between $1 and $50000'),
  residence_type: z.string().min(1, 'Residence type is required'),
  next_page: z.string().optional(),
});

// Step 2: Personal Details Schema
export const personalDetailsSchema = z.object({
  firstname: z.string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  last_name: z.string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
  dob: z.string()
    .min(1, 'Date of birth is required'),
  ssn: z.string()
    .min(1, 'SSN is required')
    .regex(/^\d{3}-\d{2}-\d{4}$/, 'SSN must be in XXX-XX-XXXX format'),
  phone_number: z.string()
    .min(1, 'Phone number is required')
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone must be in (XXX) XXX-XXXX format'),
  street_address: z.string()
    .min(1, 'Street address is required')
    .max(100, 'Street address must be less than 100 characters'),
  city: z.string()
    .min(1, 'City is required')
    .max(50, 'City must be less than 50 characters'),
  state: z.string()
    .min(1, 'State is required')
    .length(2, 'State must be 2 characters'),
  zip_code: z.string()
    .min(1, 'Zip code is required')
    .regex(/^\d{5}(-\d{4})?$/, 'Invalid zip code format'),
  months_at_address: z.string()
    .min(1, 'Months at address is required')
    .regex(/^\d+$/, 'Must be a number'),
  monthly_rent: z.string()
    .min(1, 'Monthly rent is required')
    .regex(/^\d+$/, 'Monthly rent must be a number')
    .refine((val) => {
      const num = parseInt(val);
      return num >= 0 && num <= 50000; // Max $50k rent
    }, 'Monthly rent must be between $0 and $50,000'),
});

// Step 3: Employment Details Schema
export const employmentDetailsSchema = z.object({
  employer_name: z.string()
    .min(1, 'Employer name is required')
    .max(100, 'Employer name must be less than 100 characters'),
  months_at_employer: z.string()
    .min(1, 'Months at employer is required')
    .regex(/^\d+$/, 'Must be a number')
    .refine((val) => {
      const num = parseInt(val);
      return num >= 0 && num <= 1200; // Max 100 years
    }, 'Must be between 0 and 1200 months'),
  income_source: z.string()
    .min(1, 'Income source is required')
    .refine((val) => ['1', '2', '3', '4', '5', '6'].includes(val), 'Invalid income source'),
  pay_frequency: z.string()
    .min(1, 'Pay frequency is required'),
  monthly_income: z.string()
    .min(1, 'Monthly income is required')
    .regex(/^\d+$/, 'Monthly income must be a number')
});

// Combined schema for all steps
export const completeLoanSchema = loanRequestSchema
  .merge(personalDetailsSchema)
  .merge(employmentDetailsSchema);

// Type exports
export type LoanRequestData = z.infer<typeof loanRequestSchema>;
export type PersonalDetailsData = z.infer<typeof personalDetailsSchema>;
export type EmploymentDetailsData = z.infer<typeof employmentDetailsSchema>;
export type CompleteLoanData = z.infer<typeof completeLoanSchema>;

// Validation error types for each step
export type LoanRequestValidationErrors = {
  loan_amount?: string;
  residence_type?: string;
  next_page?: string;
};

export type PersonalDetailsValidationErrors = {
  firstname?: string;
  last_name?: string;
  email?: string;
  dob?: string;
  ssn?: string;
  phone_number?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  months_at_address?: string;
  monthly_rent?: string;
};

export type EmploymentDetailsValidationErrors = {
  employer_name?: string;
  months_at_employer?: string;
  income_source?: string;
  pay_frequency?: string;
  monthly_income?: string;
};

// Combined validation errors
export type CompleteLoanValidationErrors = 
  LoanRequestValidationErrors & 
  PersonalDetailsValidationErrors & 
  EmploymentDetailsValidationErrors;

// Step validation functions
export const validateLoanRequest = (data: Partial<LoanRequestData>) => {
  try {
    loanRequestSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error: any) {
    const errors: LoanRequestValidationErrors = {};
    if (error.errors) {
      error.errors.forEach((err: any) => {
        const field = err.path[0] as keyof LoanRequestValidationErrors;
        if (field) {
          errors[field] = err.message;
        }
      });
    }
    return { isValid: false, errors };
  }
};

export const validatePersonalDetails = (data: Partial<PersonalDetailsData>) => {
  try {
    personalDetailsSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error: any) {
    const errors: PersonalDetailsValidationErrors = {};
    if (error.errors) {
      error.errors.forEach((err: any) => {
        const field = err.path[0] as keyof PersonalDetailsValidationErrors;
        if (field) {
          errors[field] = err.message;
        }
      });
    }
    return { isValid: false, errors };
  }
};

export const validateEmploymentDetails = (data: Partial<EmploymentDetailsData>) => {
  try {
    employmentDetailsSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error: any) {
    const errors: EmploymentDetailsValidationErrors = {};
    if (error.errors) {
      error.errors.forEach((err: any) => {
        const field = err.path[0] as keyof EmploymentDetailsValidationErrors;
        if (field) {
          errors[field] = err.message;
        }
      });
    }
    return { isValid: false, errors };
  }
};

export const validateCompleteLoan = (data: Partial<CompleteLoanData>) => {
  try {
    completeLoanSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error: any) {
    const errors: CompleteLoanValidationErrors = {};
    if (error.errors) {
      error.errors.forEach((err: any) => {
        const field = err.path[0] as keyof CompleteLoanValidationErrors;
        if (field) {
          errors[field] = err.message;
        }
      });
    }
    return { isValid: false, errors };
  }
};
