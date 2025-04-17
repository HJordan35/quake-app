import { Auth0Provider } from '@auth0/auth0-react'
import { useNavigate } from '@tanstack/react-router'
import { ReactNode } from 'react'

interface Auth0ProviderWithNavigateProps {
  children: ReactNode
}

// Define a more specific type for appState
interface AppState {
  returnTo?: string
  [key: string]: unknown
}

export const Auth0ProviderWithNavigate = ({ children }: Auth0ProviderWithNavigateProps) => {
  const navigate = useNavigate()

  const domain = import.meta.env.VITE_AUTH0_DOMAIN
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
  const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL || window.location.origin

  // Since we only need appState, we're ignoring the second parameter

  const onRedirectCallback = (appState?: AppState) => {
    // Navigate to the stored return path or default to the root path
    navigate({ to: appState?.returnTo || '/' })
  }

  if (!domain || !clientId) {
    throw new Error('Auth0 domain and client ID must be provided in environment variables')
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  )
}
