import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardComponent,
  beforeLoad: ({ context }) => {
    // Check if user is authenticated, redirect to login if not
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: '/dashboard',
        },
      })
    }
  },
})

function DashboardComponent() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to your protected dashboard!</p>
          <p className="mt-4">
            You are logged in as: <strong>{user?.email}</strong>
          </p>
          <div className="mt-6 p-4 bg-blue-50 text-blue-700 rounded-md">
            <p className="font-semibold">Protected Content</p>
            <p className="mt-2">This content is only visible to authenticated users.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
