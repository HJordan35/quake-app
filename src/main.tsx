import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { router } from './router'
import { Auth0ProviderWithNavigate } from './auth/Auth0Provider'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <Auth0ProviderWithNavigate>
        <RouterProvider router={router} />
      </Auth0ProviderWithNavigate>
    </StrictMode>
  )
}
