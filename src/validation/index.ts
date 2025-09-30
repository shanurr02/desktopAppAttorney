export { loginSchema, type LoginFormData, type LoginValidationErrors } from './loginSchema';
export { loanSchema, type LoanFormData, type LoanValidationErrors } from './loanSchema';
export { inviteClientSchema, type InviteClientFormData, type InviteClientValidationErrors, validateInviteClient } from './inviteClientSchema';

// Export step-specific schemas and validation functions
export {
  loanRequestSchema,
  personalDetailsSchema,
  employmentDetailsSchema,
  completeLoanSchema,
  type LoanRequestData,
  type PersonalDetailsData,
  type EmploymentDetailsData,
  type CompleteLoanData,
  type LoanRequestValidationErrors,
  type PersonalDetailsValidationErrors,
  type EmploymentDetailsValidationErrors,
  type CompleteLoanValidationErrors,
  validateLoanRequest,
  validatePersonalDetails,
  validateEmploymentDetails,
  validateCompleteLoan,
} from './loanStepSchemas';
