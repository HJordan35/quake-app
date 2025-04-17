import { createContext, useContext, ReactNode } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { NavigateOptions } from '@tanstack/react-router'

export interface User {
  email: string
  name?: string
  picture?: string
  sub?: string
  user_metadata?: {
    name?: string
    email?: string
  }
  [key: string]: unknown
}

export type NavigationOptions = NavigateOptions
export interface Auth0AppState {
  returnTo?: string
  [key: string]: unknown
}
interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (options?: { appState?: Auth0AppState }) => void
  logout: (options?: { returnTo?: string }) => void
  error: string | null
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    isAuthenticated,
    user: auth0User,
    loginWithRedirect,
    logout: auth0Logout,
    isLoading,
    error: auth0Error,
  } = useAuth0()

  const user: User | null = auth0User
    ? {
        email: auth0User.email || '',
        name: auth0User.name,
        picture: auth0User.picture,
        sub: auth0User.sub,
        ...auth0User,
      }
    : null

  console.log('user', auth0User)

  const error = auth0Error ? auth0Error.message : null

  const login = (options?: { appState?: Auth0AppState }) => {
    loginWithRedirect({
      appState: options?.appState,
    })
  }

  const logout = (options?: { returnTo?: string }) => {
    const returnTo = options?.returnTo || window.location.origin

    auth0Logout({
      logoutParams: {
        returnTo,
      },
    })
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

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
