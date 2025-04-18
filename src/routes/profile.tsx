import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeUp } from '@/components/animation/fade-up'
import { Loader2, User, AtSign } from 'lucide-react'
import { useProfileService } from '@/services/profile-service'

export const Route = createFileRoute('/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const { profile, updateUserProfile, isLoading: profileLoading } = useProfileService()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Update form values when profile is loaded
  useEffect(() => {
    if (profile) {
      setName(profile.user_metadata?.name || profile.name || '')
      setEmail(profile.user_metadata?.email || profile.email || '')
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await updateUserProfile({ name, email })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating your profile')
    } finally {
      setIsLoading(false)
    }
  }

  if (profileLoading && !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-xl font-medium">Loading your profile...</p>
      </div>
    )
  }

  return (
    <FadeUp>
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-left">Profile Information</CardTitle>
            <CardDescription className="text-left">Update your Auth0 profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 text-left">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="pl-10"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label htmlFor="email" className="text-sm text-left font-medium">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="Your email address"
                  />
                </div>
              </div>

              {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{error}</div>}

              {success && (
                <div className="bg-green-500/10 text-green-500 p-3 rounded-md text-sm">
                  Profile updated successfully!
                </div>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </FadeUp>
  )
}
