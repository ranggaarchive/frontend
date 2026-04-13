import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import authService, { type User, type LoginRequest, type RegisterRequest } from '@/services/auth.service'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  hasRole: (role: 'investor' | 'umkm' | 'auditor') => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = authService.getStoredUser()
        const token = authService.getStoredToken()

        if (storedUser && token) {
          // Verify token is still valid by fetching current user
          const currentUser = await authService.me()
          setUser(currentUser)
        }
      } catch (error) {
        console.error('Failed to load user:', error)
        // Clear invalid data
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials)
      setUser(response.data.user)

      // Redirect based on role
      switch (response.data.user.role) {
        case 'investor':
          navigate('/investor/dashboard')
          break
        case 'umkm':
          navigate('/umkm/dashboard')
          break
        case 'auditor':
          navigate('/auditor/dashboard')
          break
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data)
      setUser(response.data.user)

      // Redirect based on role
      switch (response.data.user.role) {
        case 'investor':
          navigate('/investor/dashboard')
          break
        case 'umkm':
          navigate('/umkm/dashboard')
          break
        case 'auditor':
          navigate('/auditor/dashboard')
          break
      }
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      // Still clear local state even if API call fails
      setUser(null)
      navigate('/login')
    }
  }

  const isAuthenticated = !!user

  const hasRole = (role: 'investor' | 'umkm' | 'auditor') => {
    return user?.role === role
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
