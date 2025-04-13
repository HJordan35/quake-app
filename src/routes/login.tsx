import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'
import { FadeUp } from '@/components/animation/fade-up'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')
  const { login, isLoading, error } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError('')

    // Basic validation
    if (!email) {
      setFormError('Email is required')
      return
    }

    if (!password) {
      setFormError('Password is required')
      return
    }

    try {
      // Get redirect from URL if present
      const params = new URLSearchParams(window.location.search)
      const redirectTo = params.get('redirect') || '/'

      await login({ email, password }, () => {
        // Navigate to the redirect path or home
        navigate({ to: redirectTo })
      })
    } catch {
      // Error is handled by the auth context
      console.error('Login failed')
    }
  }

  return (
    <div className="space-y-6 w-full h-full flex justify-center items-center">
      <FadeUp>
        <div className="border rounded-lg max-w-96 min-w-sm p-4">
          <h1 className="text-2xl font-bold">Login</h1>
          <div className="p-6">
            {(error || formError) && (
              <div className="mb-5 p-3 border border-red-500/50 bg-red-500/10 text-red-200 rounded-md">
                <p>{formError || error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-white/80">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-white/80">
                      Password
                    </Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
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
            </form>
          </div>
        </div>
      </FadeUp>
    </div>
  )
}
