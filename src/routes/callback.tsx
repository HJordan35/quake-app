import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/callback')({
  component: CallbackComponent,
})

function CallbackComponent() {
  useEffect(() => {
    console.log('Auth0 callback route is processing')
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-xl font-medium">Finalizing your sign-in...</p>
    </div>
  )
}
