// src/context/create-entity-context.tsx
'use client'

import * as React from 'react'
import { useSession } from 'next-auth/react'
import { fetchUserPermissions } from '@/services/permissions'

type CreateEntityState = {
  userPermissions: string[] | null
  setUserPermissions: (p: string[] | null) => void
}

const Ctx = React.createContext<CreateEntityState | undefined>(undefined)

export function CreateEntityProvider({
  children,
  initialPermissions
}: {
  children: React.ReactNode
  initialPermissions?: string[]
}) {
  const { status } = useSession()

  // hidrata com SSR
  const [userPermissions, setUserPermissions] = React.useState<string[] | null>(initialPermissions ?? null)

  // só busca no client se autenticado e ainda não temos valor
  React.useEffect(() => {
    let cancel = false
    async function load() {
      if (status !== 'authenticated') {
        setUserPermissions(null)
        return
      }
      if (userPermissions !== null) return // já hidratado

      const res = await fetchUserPermissions()
      if (cancel) return
      setUserPermissions(res.success ? res.data : [])
    }
    load()
    return () => {
      cancel = true
    }
  }, [status, userPermissions])

  const value = React.useMemo(() => ({ userPermissions, setUserPermissions }), [userPermissions])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCreateEntity() {
  const ctx = React.useContext(Ctx)
  if (!ctx) throw new Error('useCreateEntity must be used within CreateEntityProvider')
  return ctx
}
