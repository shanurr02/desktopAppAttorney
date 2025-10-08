import { apiClient } from './auth';
import { InviteClientFormData } from '../validation';

// Use the same type as the form data
export type InviteClientRequest = InviteClientFormData;

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
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all text fields
      formData.append('client_email', inviteData.client_email);
      formData.append('first_name', inviteData.first_name);
      formData.append('last_name', inviteData.last_name);
      formData.append('loan_amount', inviteData.loan_amount);
      formData.append('reference', inviteData.reference);
      formData.append('subject_line', inviteData.subject_line);
      formData.append('custom_email_text', inviteData.custom_email_text);
      
      // Handle file upload
      if (inviteData.selected_file instanceof File) {
        formData.append('selected_file', inviteData.selected_file);
      } else if (inviteData.selected_file) {
        // If it's a string (filename), create a dummy file or handle accordingly
        // For now, we'll create a text file with the filename
        const blob = new Blob([inviteData.selected_file], { type: 'text/plain' });
        const file = new File([blob], inviteData.selected_file, { type: 'text/plain' });
        formData.append('selected_file', file);
      }

      const response = await apiClient.post('/api/invite_client/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error sending client invite:', error);
      throw error;
    }
  },
};
