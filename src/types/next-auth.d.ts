import 'next-auth'
import type { DefaultSession, DefaultUser } from 'next-auth'

export type ApiProfile = {
  id: string
  token: number
  name: string
  operation: string | null
}

export type ApiUser = {
  id: string
  token: number
  name: string
  surname: string
  dateBirth: string
  showDateBirth: boolean
  email: string
  ddd: number
  phone: string
  username: string
  profile: ApiProfile[]
  lastAccessDate: string
  firstAccess: boolean
  status: boolean
}

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    expiresAt?: string
    adminAccess?: boolean
    user: DefaultSession['user'] & Partial<ApiUser>
  }

  interface User extends DefaultUser {
    _api?: {
      accessToken: string
      expiresAt: string
      adminAccess: boolean
      user: ApiUser
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    expiresAt?: string
    adminAccess?: boolean
    user?: ApiUser
  }
}

export {}
