import { apiClient } from './auth';

// Types based on the API response
export interface ApplicationData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  loan_amount: string;
  status: string;
  updated_at: string;
}

export interface ApplicationsResponse {
  applications: ApplicationData[];
}

// Individual loan application details interface
export interface LoanApplicationDetails {
  customer_id: string;
  request_id: string;
  session_id: string;
  loan_purpose: string | null;
  loan_amount: string;
  dob: string;
  ssn: string;
  residence_type: string;
  zip_code: string;
  street_address: string;
  city: string;
  state: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  months_at_address: string;
  monthly_rent: string;
  income_source: string;
  pay_frequency: string;
  monthly_income: string;
  months_at_employer: string;
  employer_name: string;
  status: string;
  error: string | null;
  response: string | null;
  screenshot: string | null;
  created_at: string;
  updated_at: string;
}

// API Functions
export const applicationsAPI = {
  getApplications: async (): Promise<ApplicationData[]> => {
    try {
      const response = await apiClient.get('/api/get_applications');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  getApplicationDetails: async (requestId: string): Promise<LoanApplicationDetails> => {
    try {
      const response = await apiClient.get(`/api/get_application_details/${requestId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching application details:', error);
      throw error;
    }
  },
};
