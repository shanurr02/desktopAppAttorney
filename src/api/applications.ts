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
};
