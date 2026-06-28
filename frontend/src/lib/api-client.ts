import axios from 'axios';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useAuthStore } from '@/stores/useAuthStore';

// Create base axios client.
// All requests point to Next.js route handlers (/api/*) which will proxy them to the backend.
export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Inject the current active workspace ID
apiClient.interceptors.request.use(
  (config) => {
    const workspaceId = useWorkspaceStore.getState().currentWorkspaceId;
    if (workspaceId && config.headers) {
      config.headers['x-workspace-id'] = workspaceId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Global error handler
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized (401), session is invalid or expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Reset stores
      useAuthStore.getState().clearAuth();
      useWorkspaceStore.getState().clearWorkspace();

      // Redirect to login page on the client side
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
