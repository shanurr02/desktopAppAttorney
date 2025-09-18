import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { applicationsAPI} from '../api/applications';

/**
 * Custom hook for fetching applications data
 */
export const useApplications = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch applications query
  const applicationsQuery = useQuery({
    queryKey: ['applications'],
    queryFn: applicationsAPI.getApplications,
    staleTime: 0, // No caching - always fetch fresh data
    gcTime: 0, // No garbage collection time
    retry: 2,
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  // Transform API data to match our LoanData interface
  const transformedApplications = applicationsQuery.data?.map((app, index) => ({
    id: `api-${index}`,
    firstname: app.first_name,
    last_name: app.last_name,
    email: app.email,
    phone_number: app.phone_number,
    dob: 'N/A',
    ssn: 'N/A',
    street_address: 'N/A',
    city: 'N/A',
    state: 'N/A',
    zip_code: 'N/A',
    months_at_address: 'N/A',
    monthly_rent: 'N/A',
    employer_name: 'N/A',
    months_at_employer: 'N/A',
    income_source: 'N/A',
    pay_frequency: 'N/A',
    monthly_income: 'N/A',
    loan_amount: app.loan_amount,
    residence_type: 'N/A',
    status: mapApiStatusToLoanStatus(app.status),
    applicationDate: formatDate(app.updated_at),
    attorneyName: 'N/A',
    caseType: 'N/A',
    priority: 'medium' as 'low' | 'medium' | 'high',
  })) || [];

  // Refresh applications function
  const refreshApplications = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await applicationsQuery.refetch();
    } catch (error) {
      console.error('Failed to refresh applications:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [applicationsQuery]);

  return {
    // State
    applications: transformedApplications,
    isLoading: applicationsQuery.isPending,
    isRefreshing,
    isError: applicationsQuery.isError,
    error: applicationsQuery.error,
    
    // Actions
    refreshApplications,
    refetch: applicationsQuery.refetch,
    
    // Raw data
    rawApplications: applicationsQuery.data,
  };
};

// Helper function to map API status to our loan status
const mapApiStatusToLoanStatus = (apiStatus: string): 'pending' | 'approved' | 'rejected' | 'funded' => {
  switch (apiStatus.toLowerCase()) {
    case 'application started':
      return 'pending';
    case 'client invited':
      return 'pending';
    case 'error':
      return 'rejected';
    case 'approved':
      return 'approved';
    case 'funded':
      return 'funded';
    default:
      return 'pending';
  }
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
};
