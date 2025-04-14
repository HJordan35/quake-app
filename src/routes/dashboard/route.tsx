import { createFileRoute, Outlet, redirect, useLocation } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { cn } from '../../lib/utils'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.pathname,
        },
      })
    }
    if (location.pathname === '/dashboard') {
      throw redirect({
        to: '/dashboard/home',
      })
    }
  },
})

function RouteComponent() {
  const { pathname } = useLocation()

  return (
    <div className="space-y-6 w-full h-full">
      <ul className="w-full border-b flex pb-6 gap-4">
        <li>
          <Link
            to="/dashboard/home"
            className={cn(
              'text-sm px-3 py-2 rounded-md transition-colors',
              pathname === '/dashboard/home' ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-secondary'
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
      <Outlet />
    </div>
  )
}
