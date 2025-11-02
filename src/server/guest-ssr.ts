import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, PreviewData } from 'next'
import type { ParsedUrlQuery } from 'querystring'
import type { Session } from 'next-auth'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

const isExpired = (expiresAt?: string) => !!expiresAt && Date.now() > Date.parse(expiresAt)

type Handler<P, Q extends ParsedUrlQuery> = (
  ctx: GetServerSidePropsContext<Q, PreviewData>
) => Promise<GetServerSidePropsResult<P>> | GetServerSidePropsResult<P>

/** Impede usuário logado de acessar páginas de auth; redireciona ao dashboard. */
export function withGuestGSSP<
  P extends Record<string, unknown> = Record<string, never>,
  Q extends ParsedUrlQuery = ParsedUrlQuery
>(options?: { defaultRedirect?: string }) {
  const defaultRedirect = options?.defaultRedirect ?? '/dashboard'

  return (handler?: Handler<P, Q>): GetServerSideProps<P, Q> => {
    return async (ctx) => {
      const session = (await getServerSession(ctx.req, ctx.res, authOptions)) as Session | null

      const callbackUrl = (ctx.query.callbackUrl as string) || defaultRedirect

      if (session && !isExpired(session.expiresAt)) {
        return {
          redirect: { destination: callbackUrl, permanent: false }
        }
      }

      if (handler) return handler(ctx)
      return { props: {} as P }
    }
  }
}
