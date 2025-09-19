import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { applicationsAPI, LoanApplicationDetails } from '../api/applications';

/**
 * Custom hook for fetching individual loan application details
 */
export const useApplicationDetails = (requestId: string | null) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch application details query
  const applicationDetailsQuery = useQuery({
    queryKey: ['applicationDetails', requestId],
    queryFn: () => applicationsAPI.getApplicationDetails(requestId!),
    enabled: !!requestId, // Only run query if requestId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
    retry: 2,
    refetchOnWindowFocus: false, // Don't refetch on window focus for details
  });

  // Refresh application details function
  const refreshApplicationDetails = useCallback(async () => {
    if (!requestId) return;
    
    setIsRefreshing(true);
    try {
      await applicationDetailsQuery.refetch();
    } catch (error) {
      console.error('Failed to refresh application details:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [requestId, applicationDetailsQuery]);

  // Helper function to get formatted application data
  const getFormattedApplicationData = useCallback((): LoanApplicationDetails | null => {
    if (!applicationDetailsQuery.data) return null;
    
    const data = applicationDetailsQuery.data;
    
    // Format the data for display
    return {
      ...data,
      // Format dates
      created_at: new Date(data.created_at).toLocaleString(),
      updated_at: new Date(data.updated_at).toLocaleString(),
      // Format loan amount with currency
      loan_amount: `$${parseInt(data.loan_amount).toLocaleString()}`,
      // Format monthly income with currency
      monthly_income: `$${parseInt(data.monthly_income).toLocaleString()}`,
      // Format monthly rent with currency
      monthly_rent: `$${parseInt(data.monthly_rent).toLocaleString()}`,
    };
  }, [applicationDetailsQuery.data]);

  // Helper function to get income source label
  const getIncomeSourceLabel = useCallback((value: string): string => {
    const incomeSourceMap: Record<string, string> = {
      "1": "Employment",
      "2": "Self-Employed", 
      "3": "Unemployment Benefits",
      "4": "Social Security",
      "5": "Disability Benefits",
      "6": "Other",
    };
    return incomeSourceMap[value] || value;
  }, []);

  // Helper function to get pay frequency label
  const getPayFrequencyLabel = useCallback((value: string): string => {
    const payFrequencyMap: Record<string, string> = {
      "1": "Weekly",
      "2": "Bi-Weekly",
      "3": "Monthly", 
      "4": "Other",
    };
    return payFrequencyMap[value] || value;
  }, []);

  // Helper function to get residence type label
  const getResidenceTypeLabel = useCallback((value: string): string => {
    const residenceTypeMap: Record<string, string> = {
      "Home Owner": "Home Owner",
      "Rent": "Rent",
      "Live with Family": "Live with Family",
      "Other": "Other",
    };
    return residenceTypeMap[value] || value;
  }, []);

  return {
    // State
    applicationDetails: applicationDetailsQuery.data,
    formattedApplicationDetails: getFormattedApplicationData(),
    isLoading: applicationDetailsQuery.isPending,
    isRefreshing,
    isError: applicationDetailsQuery.isError,
    error: applicationDetailsQuery.error,
    
    // Actions
    refreshApplicationDetails,
    refetch: applicationDetailsQuery.refetch,
    
    // Helper functions
    getIncomeSourceLabel,
    getPayFrequencyLabel,
    getResidenceTypeLabel,
    
    // Raw data
    rawApplicationDetails: applicationDetailsQuery.data,
  };
};
