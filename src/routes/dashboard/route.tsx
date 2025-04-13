import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    // Check if user is authenticated, redirect to login if not
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
    <div>
      <h1>Dashboard</h1>
      <Outlet />
    </div>
  )
}
