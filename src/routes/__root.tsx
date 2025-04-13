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
        <div className="min-h-screen bg-background flex flex-col border-white/10 border-[1px]">
          {/* Header border line */}
          <div className="border-b border-white/10">
            <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center">
              <h1 className="text-xl font-bold">Quake App</h1>
            </div>
          </div>

          {/* Main content with grid layout */}
          <div className="flex flex-grow justify-center w-full">
            {/* Left border/gutter - spans from top to bottom */}
            <div className="border-r border-white/10 w-[80px] lg:w-[120px]"></div>

            {/* Main content area */}
            <div className="flex-1 w-full max-w-6xl">
              <div className="px-6 py-6">
                <Outlet />
              </div>
            </div>

            {/* Right border/gutter - spans from top to bottom */}
            <div className="border-l border-white/10 w-[80px] lg:w-[120px]"></div>
          </div>
        </div>
      </ThemeProvider>
    </React.Fragment>
  )
}
