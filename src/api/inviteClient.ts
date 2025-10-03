import { apiClient } from './auth';

// Types - matching the exact API body structure
export interface InviteClientRequest {
  client_email: string;
  first_name: string;
  last_name: string;
  loan_amount: string;
  reference: string;
  subject_line: string;
  custom_email_text: string;
  selected_file: string;
}

export interface InviteClientResponse {
  success: boolean;
  message: string;
  invite_id?: string;
  payment_link?: string;
}

// API Functions
export const inviteClientAPI = {
  sendInvite: async (inviteData: InviteClientRequest): Promise<InviteClientResponse> => {
    try {
      const response = await apiClient.post('/api/invite_client/', inviteData);
      return response.data;
    } catch (error) {
      console.error('Error sending client invite:', error);
      throw error;
    }
  },
};
