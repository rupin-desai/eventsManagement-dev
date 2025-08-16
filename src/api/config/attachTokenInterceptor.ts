import { store } from '../../store';

/**
 * Attaches a request interceptor to the given axios instance
 * to inject the Bearer token from Redux for every request.
 */
export function attachTokenInterceptor(axiosInstance: any) {
  axiosInstance.interceptors.request.use(
    (config: any) => {
      const token = store.getState().auth.token;
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => Promise.reject(error)
  );
}