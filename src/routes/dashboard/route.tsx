import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

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
  return (
    <div className="space-y-6 w-full">
      <Outlet />
    </div>
  )
}
