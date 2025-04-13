import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isAuthenticated, user, logout, isLoading } = useAuth()
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

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Home Page</CardTitle>
        </CardHeader>
        <CardContent>
          {isAuthenticated ? (
            <div className="flex flex-col gap-4">
              <p>
                Welcome, <strong>{user?.email}</strong>!
              </p>
              <p>You are logged in.</p>
              <div className="flex gap-2">
                <Button asChild variant="default">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button onClick={handleLogout} disabled={isLoading} variant="outline">
                  {isLoading ? 'Logging out...' : 'Logout'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p>You are not logged in.</p>
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
