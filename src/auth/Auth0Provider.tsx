import { Auth0Provider } from '@auth0/auth0-react'
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
  const domain = import.meta.env.VITE_AUTH0_DOMAIN
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
  const callbackUrl = import.meta.env.VITE_AUTH0_CALLBACK_URL || `${window.location.origin}/callback`

  const onRedirectCallback = (appState?: AppState) => {
    // Navigate to the stored return path or default to the root path
    const returnPath = appState?.returnTo || '/'
    console.log('Auth0 redirect callback navigating to:', returnPath)

    // Use window.location for navigation instead of useNavigate
    // This works outside of the router context
    window.location.assign(window.location.origin + returnPath)
  }

  if (!domain || !clientId) {
    throw new Error('Auth0 domain and client ID must be provided in environment variables')
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: callbackUrl,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  )
}
