import { useState } from 'react'
import { AuthContext, User, NavigationOptions } from './AuthContext'
import { authService, LoginCredentials } from '@/lib/auth-service'

// Keys for sessionStorage
const AUTH_STORAGE_KEY = 'quake_app_auth'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize state from sessionStorage if available
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const storedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY)
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth)
        return authData.isAuthenticated || false
      } catch {
        return false
      }
    }
    return false
  })

  const [user, setUser] = useState<User | null>(() => {
    const storedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY)
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth)
        return authData.user || null
      } catch {
        return null
      }
    }
    return null
  })

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Helper function to update sessionStorage
  const updateSessionStorage = (isAuth: boolean, userData: User | null) => {
    const authData = {
      isAuthenticated: isAuth,
      user: userData,
    }
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
  }

  const login = async (credentials: LoginCredentials, onSuccess?: (options?: NavigationOptions) => void) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.login(credentials)
      setIsAuthenticated(true)
      setUser(response.user || null)

      // Store authentication data in sessionStorage
      updateSessionStorage(true, response.user || null)

      // Call navigation callback if provided
      if (onSuccess) {
        onSuccess()
      }

      return response
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during login'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (onSuccess?: (options?: NavigationOptions) => void) => {
    setIsLoading(true)

    try {
      await authService.logout()
      setIsAuthenticated(false)
      setUser(null)

      // Remove authentication data from sessionStorage
      sessionStorage.removeItem(AUTH_STORAGE_KEY)

      // Call navigation callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during logout'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        error,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
