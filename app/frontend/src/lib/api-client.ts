import axios, { AxiosError } from 'axios';
import config from '@/lib/config';

const SESSION_COOKIE_NAME = 'accessToken';

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

export const apiClient = axios.create({
  baseURL: config.urls.api,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token
apiClient.interceptors.request.use((requestConfig) => {
  const token = getCookieValue(SESSION_COOKIE_NAME);
  if (token && requestConfig.headers) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

// Response interceptor: handle 401 unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear cookies and redirect to login
      if (typeof document !== 'undefined') {
        document.cookie = `${SESSION_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
