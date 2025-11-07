// src/pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import type { ApiUser } from '@/types/next-auth'
import { loginWithCredentials } from '@/services/authentication'

function hasApiPayload(
  user: unknown
): user is { _api: { accessToken: string; expiresAt: string; adminAccess: boolean; user: ApiUser } } {
  return typeof user === 'object' && user !== null && '_api' in user
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/sign-in' },
  providers: [
    Credentials({
      name: 'Credentials-login',
      credentials: {
        identifier: { label: 'Usuário ou e-mail', type: 'text' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null

        const res = await loginWithCredentials({
          identifier: credentials.identifier,
          password: credentials.password
        })

        if (!res.success) {
          // NextAuth exibe a message se você lançar Error
          throw new Error(res.error || 'Falha ao autenticar.')
        }

        const { token, expiration, adminAccess, user } = res.data

        return {
          id: user.id,
          name: `${user.name ?? ''} ${user.surname ?? ''}`.trim(),
          email: user.email,
          _api: {
            accessToken: token,
            expiresAt: expiration,
            adminAccess,
            user
          }
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Primeira passada após authorize(): transfere payload para o JWT
      if (user && hasApiPayload(user)) {
        token.accessToken = user._api.accessToken
        token.expiresAt = user._api.expiresAt
        token.adminAccess = user._api.adminAccess
        token.user = user._api.user
      }

      if (trigger === 'update' && session?.user) {
        token.user = { ...(token.user ?? {}), ...(session.user as ApiUser) }
      }

      // (Opcional) invalidar/refresh
      if (token.expiresAt && Date.now() > Date.parse(token.expiresAt)) {
        // Ex.: apagar para forçar re-login (ou implementar refresh aqui)
        // delete token.accessToken
        // delete token.user
      }

      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined
      session.expiresAt = token.expiresAt as string | undefined
      session.adminAccess = token.adminAccess as boolean | undefined
      if (token.user) {
        session.user = { ...session.user, ...(token.user as ApiUser) }
      }
      return session
    }
  }
}

export default NextAuth(authOptions)
