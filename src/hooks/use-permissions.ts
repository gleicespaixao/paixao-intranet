import { useCreateEntity } from '@/context/create-entity-context'
import { useCheckAdminProfile, useCheckDevProfile } from './use-check-admin-profile'

export const usePermissions = (permission: string[]) => {
  const { userPermissions } = useCreateEntity()
  const isAdmin = useCheckAdminProfile()
  const isDev = useCheckDevProfile()

  if (isAdmin || isDev) return true
  if (!userPermissions || userPermissions.length === 0) return false

  return permission.some((p) => userPermissions.includes(p))
}
