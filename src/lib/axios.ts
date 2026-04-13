import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Return response data directly
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token')
        
        if (refreshToken) {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3333/api'}/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          )

          const { token } = response.data.data

          // Save new token
          localStorage.setItem('auth_token', token)

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        
        // Redirect to login
        window.location.href = '/login'
        
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    return Promise.reject(error)
  }
)

export default api
