import * as React from 'react'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { ThemeProvider } from '@/components/theme/theme-provider'
import '../__root.css'
import { AuthProvider } from '@/context/AuthContextProvider'

interface MyRouterContext {
  auth: {
    isAuthenticated: boolean
  }
}
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => <RootComponent />,
})

function RootComponent() {
  return (
    <React.Fragment>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Outlet />
        </ThemeProvider>
      </AuthProvider>
    </React.Fragment>
  )
}
