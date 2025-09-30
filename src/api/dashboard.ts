import { apiClient } from './auth';

// Types based on the API responses
export interface ActiveClientsResponse {
  active_clients: number;
  application_started: number;
}

export interface RecentClient {
  first_name: string;
  last_name: string;
  status: string;
  updated_at: string;
}

export interface RecentClientsResponse extends Array<RecentClient> {}

// API Functions
export const dashboardAPI = {
  getActiveClients: async (): Promise<ActiveClientsResponse> => {
    try {
      const response = await apiClient.get('/api/active_clients/');
      return response.data;
    } catch (error) {
      console.error('Error fetching active clients:', error);
      throw error;
    }
  },

  getRecentClients: async (): Promise<RecentClientsResponse> => {
    try {
      const response = await apiClient.get('/api/recent_clients/');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent clients:', error);
      throw error;
    }
  },
};
