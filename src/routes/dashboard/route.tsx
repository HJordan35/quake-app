import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AuthGuard } from '@/auth/AuthGuard'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  beforeLoad: ({ location }) => {
    if (location.pathname === '/dashboard') {
      throw redirect({
        to: '/dashboard/home',
      })
    }
  },
})

function RouteComponent() {
  return (
    <AuthGuard>
      <div className="space-y-6 w-full h-full">
        <Outlet />
      </div>
    </AuthGuard>
  )
}
