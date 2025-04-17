import { Auth0Provider } from '@auth0/auth0-react'
import { ReactNode } from 'react'

interface Auth0ProviderWithNavigateProps {
  children: ReactNode
}

export const Auth0ProviderWithNavigate = ({ children }: Auth0ProviderWithNavigateProps) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
  const callbackUrl = import.meta.env.VITE_AUTH0_CALLBACK_URL || `${window.location.origin}/dashboard/home`

  const onRedirectCallback = () => {
    console.log('Auth Completed')
    if (!domain || !clientId) {
      throw new Error('Auth0 domain and client ID must be provided in environment variables')
    }
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: callbackUrl,
        scope: 'openid profile email read:current_user read:current_user_metadata update:current_user_metadata',
        audience: `https://${domain}/api/v2/`,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  )
}
