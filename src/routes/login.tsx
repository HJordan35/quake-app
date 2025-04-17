import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/auth/AuthContext'
import { Loader2 } from 'lucide-react'
import { FadeUp } from '@/components/animation/fade-up'

// Define the search params for this route
export const Route = createFileRoute('/login')({
  component: RouteComponent,
  validateSearch: search => {
    return {
      redirect: search.redirect ? String(search.redirect) : '/',
    }
  },
})

function RouteComponent() {
  const { login, isLoading, error } = useAuth()
  const { redirect } = Route.useSearch()

  const handleLogin = () => {
    // Call login with appState containing the redirect path
    login({
      appState: {
        returnTo: redirect,
      },
    })
  }

  return (
    <div className="space-y-6 w-full h-full flex justify-center items-center">
      <FadeUp>
        <div className="border rounded-lg max-w-96 min-w-sm p-4">
          <h1 className="text-2xl font-bold">Welcome to Quake App</h1>
          <div className="p-6">
            {error && (
              <div className="mb-5 p-3 border border-red-500/50 bg-red-500/10 text-red-200 rounded-md">
                <p>{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-6">
              <Button onClick={handleLogin} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </div>
          </div>
        </div>
      </FadeUp>
    </div>
  )
}
