import { ApiAddress, ApiItemLinks, ApiLog } from './utils'

export type ApiCompany = {
  id: string
  token: number
  customer: ApiItemLinks[]
  name: string
  phone: string
  email: string
  cnpj: string
  address: ApiAddress
  logs: ApiLog
}
