import { useState, useEffect, useCallback } from 'react';
import { getActivities } from '../api/activityApi';
import type { Activity, ActivityStatus } from '../api/activityApi';
import { AxiosError } from 'axios';

interface UseActivitiesReturn {
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  fetchActivities: (status?: ActivityStatus) => Promise<void>;
  refetch: () => void;
  clearError: () => void;
}

export const useActivities = (initialStatus: ActivityStatus = 'A'): UseActivitiesReturn => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<ActivityStatus>(initialStatus);

  const fetchActivities = useCallback(async (status: ActivityStatus = currentStatus) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getActivities(status);
      setActivities(response.data);
      setCurrentStatus(status);
    } catch (err) {
      console.error('Error fetching activities:', err);
      
      if (err instanceof AxiosError) {
        if (err.response) {
          setError(`Failed to fetch activities: ${err.response.status} ${err.response.statusText}`);
        } else if (err.request) {
          setError('Network error: Unable to fetch activities');
        } else {
          setError('Error fetching activities: ' + err.message);
        }
      } else {
        setError('An unexpected error occurred while fetching activities');
      }
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentStatus]);

  const refetch = useCallback(() => {
    fetchActivities(currentStatus);
  }, [fetchActivities, currentStatus]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch activities on mount
  useEffect(() => {
    fetchActivities(initialStatus);
  }, [fetchActivities, initialStatus]);

  return {
    activities,
    isLoading,
    error,
    fetchActivities,
    refetch,
    clearError
  };
};

/**
 * Hook to fetch only active activities
 */
export const useActiveActivities = () => {
  return useActivities('A');
};