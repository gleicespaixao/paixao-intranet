import NextAuth, { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { api } from '@/lib/api'
import type { ApiUser } from '@/types/next-auth' // reutiliza os tipos
import { getApiErrorMessage } from '@/lib/http-error'

type ApiAuthResponse = {
  token: string
  expiration: string // ISO
  adminAccess: boolean
  user: ApiUser
}

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

        try {
          const { data } = await api.post<ApiAuthResponse>('/authentication/login', {
            identifier: credentials.identifier,
            password: credentials.password
          })

          if (!data?.token) {
            throw new Error('Resposta inválida da API.')
          }

          return {
            id: data.user.id,
            name: `${data.user.name} ${data.user.surname}`.trim(),
            email: data.user.email,
            _api: {
              accessToken: data.token,
              expiresAt: data.expiration,
              adminAccess: data.adminAccess,
              user: data.user
            }
          }
        } catch (err) {
          const apiMsg = getApiErrorMessage(err) ?? 'Falha ao autenticar.'
          throw new Error(apiMsg)
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 1ª passada após login: mover dados do authorize (user._api) para o JWT
      if (user && hasApiPayload(user)) {
        token.accessToken = user._api.accessToken
        token.expiresAt = user._api.expiresAt
        token.adminAccess = user._api.adminAccess
        token.user = user._api.user
      }

      // (Opcional) invalidar se expirado. Ou faça refresh aqui se sua API suportar.
      if (token.expiresAt && Date.now() > Date.parse(token.expiresAt)) {
        // Exemplo simples: limpar payload para forçar re-login depois
        // delete token.accessToken
        // delete token.user
      }

      return token
    },
    async session({ session, token }) {
      // Expor no client o que guardamos no JWT
      session.accessToken = token.accessToken
      session.expiresAt = token.expiresAt
      session.adminAccess = token.adminAccess
      if (token.user) {
        // mescla info detalhada no session.user sem perder name/email/image do NextAuth
        session.user = { ...session.user, ...token.user }
      }
      return session
    }
  }
}

export default NextAuth(authOptions)
