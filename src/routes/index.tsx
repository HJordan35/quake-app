import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
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
    <div className="space-y-6 w-full">
      <div className="border-b border-white/10 pb-2 mb-6">
        <h1 className="text-2xl font-bold">Home Page</h1>
      </div>

      <div className="border border-white/10 rounded-lg bg-black/20">
        <div className="p-6">
          {isAuthenticated ? (
            <div className="flex flex-col gap-4">
              <div className="border-b border-white/5 pb-4">
                <p className="text-white/80">
                  Welcome, <span className="text-white font-medium">{user?.email}</span>!
                </p>
                <p className="text-white/60 mt-1">You are logged in and can access all features.</p>
              </div>
              <div className="flex gap-2 mt-2">
                <Button asChild className="border border-white/20 bg-white/5 hover:bg-white/10 text-white">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="border border-white/10 bg-transparent hover:bg-white/5 text-white/80"
                >
                  {isLoading ? 'Logging out...' : 'Logout'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="border-b border-white/5 pb-4">
                <p className="text-white/80">You are not logged in.</p>
                <p className="text-white/60 mt-1">Log in to access the dashboard and other features.</p>
              </div>
              <Button asChild className="border border-white/20 bg-white/5 hover:bg-white/10 text-white w-fit mt-2">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
