import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'
import { Spinner } from '@/components/ui/spinner'
export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('isAuthenticated', isAuthenticated)
    if (isAuthenticated && !isLoading) {
      navigate({ to: '/dashboard/home' })
    } else if (!isAuthenticated && !isLoading) {
      navigate({ to: '/login', search: { redirect: '/dashboard/home' } })
    }
  }, [isAuthenticated, isLoading, navigate])

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <Spinner />
    </div>
  )
}
