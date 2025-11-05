import 'next-auth'
import { DefaultSession } from 'next-auth'

export type ApiUser = {
  id: string
  token: number
  name: string
  surname: string
  dateBirth: string
  showDateBirth: boolean
  email: string
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
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    expiresAt?: string
    adminAccess?: boolean
    user?: ApiUser
  }
}
