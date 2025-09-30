import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI, ActiveClientsResponse, RecentClientsResponse } from '../api/dashboard';

/**
 * Custom hook for fetching dashboard data
 */
export const useDashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch active clients query
  const activeClientsQuery = useQuery({
    queryKey: ['activeClients'],
    queryFn: dashboardAPI.getActiveClients,
    staleTime: 0, // No caching - always fetch fresh data
    gcTime: 0, // No garbage collection time
    retry: 2,
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  // Fetch recent clients query
  const recentClientsQuery = useQuery({
    queryKey: ['recentClients'],
    queryFn: dashboardAPI.getRecentClients,
    staleTime: 0, // No caching - always fetch fresh data
    gcTime: 0, // No garbage collection time
    retry: 2,
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  // Transform recent clients data for display
  const transformedRecentClients = recentClientsQuery.data?.map((client) => ({
    ...client,
    fullName: `${client.first_name} ${client.last_name}`,
    formattedDate: formatDate(client.updated_at),
    statusColor: getStatusColor(client.status),
    statusLabel: getStatusLabel(client.status),
  })) || [];

  // Refresh dashboard data function
  const refreshDashboard = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        activeClientsQuery.refetch(),
        recentClientsQuery.refetch(),
      ]);
    } catch (error) {
      console.error('Failed to refresh dashboard data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [activeClientsQuery, recentClientsQuery]);

  return {
    // State
    activeClients: activeClientsQuery.data,
    recentClients: transformedRecentClients,
    isLoading: activeClientsQuery.isPending || recentClientsQuery.isPending,
    isRefreshing,
    isError: activeClientsQuery.isError || recentClientsQuery.isError,
    error: activeClientsQuery.error || recentClientsQuery.error,
    
    // Actions
    refreshDashboard,
    refetch: () => Promise.all([
      activeClientsQuery.refetch(),
      recentClientsQuery.refetch(),
    ]),
    
    // Raw data
    rawActiveClients: activeClientsQuery.data,
    rawRecentClients: recentClientsQuery.data,
  };
};

// Helper function to get status color based on status
const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'application started':
      return 'blue';
    case 'client invited':
      return 'green';
    case 'approved':
      return 'green';
    case 'funded':
      return 'purple';
    case 'error':
      return 'red';
    default:
      return 'gray';
  }
};

// Helper function to get status label
const getStatusLabel = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'application started':
      return 'Application Started';
    case 'client invited':
      return 'Client Invited';
    case 'approved':
      return 'Approved';
    case 'funded':
      return 'Funded';
    case 'error':
      return 'Error';
    default:
      return status;
  }
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
};
