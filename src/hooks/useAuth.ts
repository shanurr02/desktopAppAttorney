import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI, LoginRequest, User } from '../api/auth';

// Custom hook for authentication state management
export const useAuth = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();

  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    return !!(token && userData);
  };

  // Get current user data
  const getCurrentUser = (): User | null => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  };

  // Initialize auth state on app start
  useEffect(() => {
    const initializeAuth = () => {
      // Just check if we have valid stored data
      if (isLoggedIn()) {
        // Set the current user data in React Query cache
        const userData = getCurrentUser();
        if (userData) {
          queryClient.setQueryData(['currentUser'], userData);
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, [queryClient]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      // Some backends return `user_group` instead of `group`.
      const incomingUser: any = data.user as any;
      const normalizedGroup = (incomingUser.user_group || 'client') as 'attorney' | 'client';

      // Transform user data to include computed fields and normalized group
      const transformedUser = {
        ...incomingUser,
        group: normalizedGroup,
        name: `${incomingUser.first_name} ${incomingUser.last_name || ''}`.trim(),
        userType: normalizedGroup === 'attorney' ? 'Attorney' : 'Client',
      };

      // Store token and user data
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(transformedUser));

      // Update React Query cache
      queryClient.setQueryData(['currentUser'], transformedUser);

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      // Clear React Query cache
      queryClient.clear();
    },
    onError: () => {
      // Even if logout fails on server, clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      queryClient.clear();
    },
  });

  // Get current user from React Query cache
  const currentUser = queryClient.getQueryData<User>(['currentUser']);

  // Login function
  const login = useCallback(async (credentials: LoginRequest) => {
    return loginMutation.mutateAsync(credentials);
  }, [loginMutation]);

  // Logout function
  const logout = useCallback(async () => {
    return logoutMutation.mutateAsync();
  }, [logoutMutation]);

  return {
    // State
    isLoggedIn: isLoggedIn() && !!currentUser,
    isLoading: loginMutation.isPending || logoutMutation.isPending || !isInitialized,
    currentUser: currentUser || getCurrentUser(),
    
    // Actions
    login,
    logout,
    
    // Mutation states
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
  };
};
