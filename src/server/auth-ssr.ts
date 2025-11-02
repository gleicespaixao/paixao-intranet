import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, PreviewData } from 'next'
import type { ParsedUrlQuery } from 'querystring'
import type { Session } from 'next-auth'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

const isExpired = (expiresAt?: string) => !!expiresAt && Date.now() > Date.parse(expiresAt)

type Handler<P, Q extends ParsedUrlQuery> = (
  ctx: GetServerSidePropsContext<Q, PreviewData>,
  session: Session
) => Promise<GetServerSidePropsResult<P>> | GetServerSidePropsResult<P>

/** Exige sessão válida; se não houver/expirou → redireciona ao login. */
export function withAuthGSSP<
  P extends Record<string, unknown> = Record<string, never>,
  Q extends ParsedUrlQuery = ParsedUrlQuery
>(options?: { signinPath?: string }) {
  const signinPath = options?.signinPath ?? '/signin'

  return (handler?: Handler<P, Q>): GetServerSideProps<P, Q> => {
    return async (ctx) => {
      const session = (await getServerSession(ctx.req, ctx.res, authOptions)) as Session | null
      const callbackUrl = ctx.resolvedUrl || '/dashboard'

      if (!session || isExpired(session.expiresAt)) {
        return {
          redirect: {
            destination: `${signinPath}?callbackUrl=${encodeURIComponent(callbackUrl)}`,
            permanent: false
          }
        }
      }

      if (handler) return handler(ctx, session)
      return { props: {} as P }
    }
  }
}
