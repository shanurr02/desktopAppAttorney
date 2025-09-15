import { apiClient } from './auth';

// Types
export interface AddressValidationRequest {
  zipcode: string;
}

export interface AddressValidationResponse {
  city: string;
  state: string;
}

// API Functions
export const addressAPI = {
  validateAddress: async (zipcode: string): Promise<AddressValidationResponse> => {
    const response = await apiClient.get(`/api/address_validation/?zipcode=${zipcode}`);
    return response.data;
  },
};
