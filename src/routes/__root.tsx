import * as React from 'react'
import { Outlet, createRootRouteWithContext, useNavigate } from '@tanstack/react-router'
import { ThemeProvider } from '@/components/theme/theme-provider'
import '../__root.css'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { UserIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
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
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const handleLogout = async () => {
    try {
      await logout(() => {
        navigate({ to: '/login' })
      })
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  const handleAccount = () => {
    // Navigate to account page or show account modal
    console.log('Account clicked')
  }

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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <UserIcon className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleAccount}>Account</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
