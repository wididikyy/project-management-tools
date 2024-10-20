import { useSession } from 'next-auth/react'
import { Session } from 'next-auth'

export function useAuth() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'

  return {
    session: session as Session & { user: { id: string; role: string, username: string } },
    isAuthenticated,
    isLoading,
  }
}