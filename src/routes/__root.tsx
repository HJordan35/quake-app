import * as React from 'react'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { ThemeProvider } from '@/components/theme/theme-provider'
import '../__root.css'

interface MyRouterContext {
  auth: {
    isAuthenticated: boolean
    user: { email: string } | null
  }
}
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => <RootComponent />,
})

function RootComponent() {
  return (
    <React.Fragment>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Outlet />
      </ThemeProvider>
    </React.Fragment>
  )
}
