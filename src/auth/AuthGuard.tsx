import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useNavigate, useLocation } from '@tanstack/react-router'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * AuthGuard component to protect routes that require authentication
 * It redirects to login page if user is not authenticated
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      navigate({
        to: '/login',
        search: {
          redirect: location.pathname + location.search,
        },
        replace: true,
      })
    }
  }, [isAuthenticated, isLoading, navigate, location])

  // Show fallback while loading or not authenticated
  if (isLoading || !isAuthenticated) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-muted-foreground">Checking authentication...</p>
      </div>
    )
  }

  // Render children if authenticated
  return <>{children}</>
}
