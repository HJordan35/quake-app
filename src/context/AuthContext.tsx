import { createContext, useContext } from 'react'
import { AuthResponse, LoginCredentials } from '@/services/auth-service'

export interface User {
  email: string
}

export interface NavigationOptions {
  path: string
  search?: Record<string, string>
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (credentials: LoginCredentials, onSuccess?: (options?: NavigationOptions) => void) => Promise<AuthResponse>
  logout: (onSuccess?: (options?: NavigationOptions) => void) => Promise<void>
  error: string | null
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => ({ success: false, message: 'Not implemented' }),
  logout: async () => {},
  error: null,
  isLoading: false,
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
