import * as React from 'react'
import { Outlet, createRootRouteWithContext, useNavigate } from '@tanstack/react-router'
import { ThemeProvider } from '@/components/theme/theme-provider'
import '../__root.css'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { UserIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

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
        <div className="min-h-screen bg-background flex flex-col border-white/10 border-[1px]">
          <div className="border-b  flex justify-between">
            <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center">
              <h1 className="text-xl font-bold">Quake App</h1>
            </div>
            {isAuthenticated && (
              <div className="mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
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
            )}
          </div>

          <div className="flex flex-grow justify-center w-full">
            <div className="border-r border-white/10 w-[80px] lg:w-[120px]"></div>

            <div className="flex-1 w-full max-w-6xl">
              <div className="px-6 py-6 h-full">
                <Outlet />
              </div>
            </div>

            <div className="border-l border-white/10 w-[80px] lg:w-[120px]"></div>
          </div>
        </div>
      </ThemeProvider>
    </React.Fragment>
  )
}
