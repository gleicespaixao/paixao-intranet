import { envConfig } from '@/lib/env'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

/**
 * Hook para verificar se o usuário logado tem perfil de administrador
 * @returns {boolean} Retorna true se o usuário tem perfil de administrador, false caso contrário
 */
export const useCheckAdminProfile = (): boolean => {
  const { data: session } = useSession()

  const isAdmin = useMemo(() => {
    if (!session?.user?.profile) return false

    return session.user.profile.some((profile) => profile.id === envConfig.profileMasterId)
  }, [session])

  return isAdmin
}

export const useCheckDevProfile = (): boolean => {
  const { data: session } = useSession()

  const isDev = useMemo(() => {
    if (!session?.user?.profile) return false

    return session.user.profile.some((profile) => profile.id === envConfig.devProfileId)
  }, [session])

  return isDev
}
