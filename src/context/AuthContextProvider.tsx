import { useState } from 'react'
import { AuthContext } from './AuthContext'
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>{children}</AuthContext.Provider>
}
