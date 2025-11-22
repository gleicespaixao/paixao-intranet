import { ApiItemLinks, ApiLog } from './utils'

export type ApiDevelopment = {
  id: string
  token: number
  name: string
  neighborhood: ApiItemLinks
  realEstateDeveloper: string
  status: boolean
  logs: ApiLog
}

export type ApiDevelopmentCreateUpdate = {
  name: string
  status: boolean
  neighborhood: { id: string }
}
