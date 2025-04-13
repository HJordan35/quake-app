import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { User } from './context/AuthContext'

// Define the router context interface
interface RouterContext {
  auth: {
    isAuthenticated: boolean
    user: User | null
    error: string | null
    isLoading: boolean
  }
}

export const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  } as RouterContext,
})
