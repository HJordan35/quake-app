import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
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
    if (location.pathname === '/') {
      console.log('redirecting to dashboard/home')
      throw redirect({
        to: '/dashboard/home',
      })
    }
  },
})

function RouteComponent() {
  return <div className="space-y-6 w-full">Test</div>
}
