import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { ThemeProvider } from '@/components/theme/theme-provider'
import '../__root.css'
import { useAuth, AuthProvider } from '@/context/AuthContext'
import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { UserMenu } from '@/auth/UserMenu'

export const Route = createRootRoute({
  component: () => <RootComponent />,
})

function RootComponent() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  )
}

function AppLayout() {
  const { isAuthenticated } = useAuth()
  const { pathname } = useLocation()

  return (
    <React.Fragment>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="h-screen flex flex-col bg-background">
          <div className="border-b h-14 shrink-0 flex justify-between">
            <div className="px-4 sm:px-6 lg:px-8 flex items-center">
              <h1 className="text-xl font-bold">Quake App</h1>
            </div>
            {isAuthenticated && (
              <>
                <ul className="grow flex justify-center items-center gap-4">
                  <li>
                    <Link
                      to="/dashboard/home"
                      className={cn(
                        'text-sm px-3 py-2 rounded-md transition-colors',
                        pathname === '/dashboard/home'
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'hover:bg-secondary'
                      )}
                    >
                      Real-Time Events
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/explore"
                      className={cn(
                        'text-sm px-3 py-2 rounded-md transition-colors',
                        pathname === '/dashboard/explore'
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'hover:bg-secondary'
                      )}
                    >
                      Explore
                    </Link>
                  </li>
                </ul>
                <div className="px-4 sm:px-6 lg:px-8 flex items-center">
                  <UserMenu />
                </div>
              </>
            )}
          </div>

          <div className="flex flex-1 justify-center w-full overflow-hidden">
            <div className="border-r border-white/10 w-[80px] lg:w-[120px] shrink-0"></div>

            <div className="flex-1 max-w-6xl p-6 overflow-hidden">
              <Outlet />
            </div>

            <div className="border-l border-white/10 w-[80px] lg:w-[120px] shrink-0"></div>
          </div>
        </div>
      </ThemeProvider>
    </React.Fragment>
  )
}
