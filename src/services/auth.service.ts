import api from '@/lib/axios'

export interface LoginRequest {
  email: string
  password: string
  role: 'investor' | 'umkm' | 'auditor'
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  phone: string
  role: 'investor' | 'umkm' | 'auditor'
  // UMKM specific fields
  businessName?: string
  category?: 'fb' | 'retail' | 'fashion' | 'service' | 'manufacture'
  description?: string
  address?: string
  annualRevenue?: number
  employees?: number
}

export interface User {
  id: number
  fullName: string
  email: string
  phone: string | null
  role: 'investor' | 'umkm' | 'auditor'
  isVerified: boolean
  balance: number
}

export interface AuthResponse {
  message: string
  data: {
    user: User
    token: string
  }
}

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials)
    
    // Save token and user to localStorage
    if (response.data.data.token) {
      localStorage.setItem('auth_token', response.data.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
    }
    
    return response.data
  }

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data)
    
    // Save token and user to localStorage
    if (response.data.data.token) {
      localStorage.setItem('auth_token', response.data.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
    }
    
    return response.data
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    }
  }

  /**
   * Get current user
   */
  async me(): Promise<User> {
    const response = await api.get<{ data: User }>('/auth/me')
    
    // Update user in localStorage
    localStorage.setItem('user', JSON.stringify(response.data.data))
    
    return response.data.data
  }

  /**
   * Refresh token
   */
  async refreshToken(): Promise<string> {
    const response = await api.post<{ data: { token: string } }>('/auth/refresh')
    
    // Save new token
    if (response.data.data.token) {
      localStorage.setItem('auth_token', response.data.data.token)
    }
    
    return response.data.data.token
  }

  /**
   * Get stored user from localStorage
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  /**
   * Get stored token from localStorage
   */
  getStoredToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getStoredToken()
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: 'investor' | 'umkm' | 'auditor'): boolean {
    const user = this.getStoredUser()
    return user?.role === role
  }
}

export default new AuthService()
