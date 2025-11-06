import type { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { fetchUserPermissionsSSR } from '@/services/permissions'

const isExpired = (expiresAt?: string) => !!expiresAt && Date.now() > Date.parse(expiresAt)

/** Exige sessão válida; se não houver/expirou → redireciona ao login. */
export const withAuthGSSP = () => async (ctx: GetServerSidePropsContext) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)

  if (!session || isExpired(session.expiresAt)) {
    return {
      redirect: {
        destination: `/sign-in?callbackUrl=${encodeURIComponent(ctx.resolvedUrl)}`,
        permanent: false
      }
    }
  }
  let initialPermissions: string[] = []
  if (session.accessToken) {
    const res = await fetchUserPermissionsSSR(session.accessToken)
    if (res.success) initialPermissions = res.data
  }

  return {
    props: toJSONSafe({
      session,
      initialPermissions
    })
  }
}

function toJSONSafe<T>(data: T): T {
  // remove undefined (e funções) de forma segura
  return JSON.parse(JSON.stringify(data)) as T
}
