import type { GetServerSideProps } from 'next'
import type { Session } from 'next-auth'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'

const isExpired = (expiresAt?: string) => !!expiresAt && Date.now() > Date.parse(expiresAt)

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = (await getServerSession(ctx.req, ctx.res, authOptions)) as Session | null

  if (session && !isExpired(session.expiresAt)) {
    return { redirect: { destination: '/dashboard', permanent: false } }
  }

  return { redirect: { destination: '/signin', permanent: false } }
}

export default function HomeRedirect() {
  return null
}
