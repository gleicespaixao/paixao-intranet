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

export type ApiCompanyCreateUpdate = {
  name: string
  phone?: string | null
  email?: string | null
  cnpj?: string
  address: {
    postalCode?: string
    street?: string
    addressLine2?: string
    streetNumber?: string
    neighborhood?: string
    city?: string
    state?: string
  } | null
}
