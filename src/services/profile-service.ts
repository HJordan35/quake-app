import { User } from '@/auth/AuthContext'
import { useAuth0 } from '@auth0/auth0-react'
import { useState, useCallback, useEffect } from 'react'

export interface UserProfile extends User {
  user_metadata: {
    name?: string
    email?: string
    [key: string]: unknown
  }
}

export function useProfileService() {
  const { user: auth0User, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserProfile = useCallback(async () => {
    if (!isAuthenticated || !auth0User?.sub) {
      setProfile(null)
      return null
    }

    try {
      setIsLoading(true)
      setError(null)

      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`,
          scope: 'openid profile email read:current_user read:current_user_metadata',
        },
      })

      const userId = auth0User.sub
      const domain = import.meta.env.VITE_AUTH0_DOMAIN
      const response = await fetch(`https://${domain}/api/v2/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user profile')
      }

      const userData = await response.json()

      const userProfile: UserProfile = {
        email: auth0User.email || '',
        name: auth0User.name,
        picture: auth0User.picture,
        sub: auth0User.sub,
        user_metadata: userData.user_metadata || {},
        ...auth0User,
      }

      setProfile(userProfile)
      return userProfile
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      console.error('Error fetching user profile:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, auth0User, getAccessTokenSilently])

  const updateUserProfile = useCallback(
    async (updates: { name?: string; email?: string }) => {
      if (!isAuthenticated || !auth0User?.sub) {
        throw new Error('User not authenticated')
      }

      try {
        setIsLoading(true)
        setError(null)

        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`,
            scope: 'openid profile email update:current_user_metadata',
          },
        })

        const userId = auth0User.sub
        const domain = import.meta.env.VITE_AUTH0_DOMAIN

        const response = await fetch(`https://${domain}/api/v2/users/${userId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_metadata: {
              name: updates.name,
              email: updates.email,
            },
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to update profile')
        }

        return await fetchUserProfile()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'
        setError(errorMessage)
        console.error('Error updating user profile:', err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, auth0User, getAccessTokenSilently, fetchUserProfile]
  )

  useEffect(() => {
    if (isAuthenticated && auth0User) {
      fetchUserProfile()
    }
  }, [isAuthenticated, auth0User, fetchUserProfile])

  return {
    profile,
    isLoading,
    error,
    fetchUserProfile,
    updateUserProfile,
  }
}
