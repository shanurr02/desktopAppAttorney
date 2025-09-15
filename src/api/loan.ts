import { apiClient } from './auth';
import { z } from 'zod';

// Types
export interface LoanApplicationRequest {
  session_id: string;
  loan_amount: string;
  residence_type: string;
  next_page?: string;
  firstname: string;
  last_name: string;
  email: string;
  dob: string;
  ssn: string;
  street_address: string;
  city: string;
  state: string;
  months_at_address: string;
  monthly_rent: string;
  zip_code: string;
  phone_number: string;
  income_source: string;
  pay_frequency: string;
  monthly_income: string;
  months_at_employer: string;
  employer_name: string;
}

export interface LoanApplicationResponse {
  success: boolean;
  message: string;
  next_page?: string;
  session_id?: string;
  status?: string;
}

export interface ProcessApplicationRequest {
  authToken: string;
}

export interface ProcessApplicationResponse {
  session_id: string;
}

// API Functions
export const loanAPI = {
  processApplication: async (authToken: string): Promise<ProcessApplicationResponse> => {
    const response = await apiClient.post('/process_application/', null, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  },
  
  submitApplication: async (applicationData: LoanApplicationRequest): Promise<LoanApplicationResponse> => {
    const response = await apiClient.post('/submit_offers/', applicationData);
    return response.data;
  },
};
