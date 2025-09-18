import { apiClient } from './auth';

// Types
export interface PhoneValidationRequest {
  phone: string;
}

export interface PhoneValidationResponse {
  valid: boolean;
}

// API Functions
export const phoneAPI = {
  validatePhone: async (phone: string): Promise<PhoneValidationResponse> => {
    const response = await apiClient.get(`/api/phone_validation/?phone=${phone}`);
    return response.data;
  },
};
