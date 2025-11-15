import { ApiBedrooms, ApiGarages, ApiPurchaseGoals } from '@/schemas/customer'
import { ApiAddress, ApiLog } from './utils'

import { ApiItemLinks } from './utils'
export type APICustomerStatus = 'active' | 'inactive' | 'paused'
export type APICustomerMaritalStatus = 'single' | 'married' | 'separated' | 'widowed' | 'other'
export type APICustomerPropertyProfilePurchaseGoals = ApiPurchaseGoals
export type APICustomerPropertyProfileBedrooms = ApiBedrooms
export type APICustomerPropertyProfileGarage = ApiGarages

export type ApiCustomer = {
  id: string
  status: APICustomerStatus
  token: number
  name: string
  phone: string
  email: string
  rg: string
  cpf: string
  dateBirth: string | null
  profession: string
  maritalStatus: APICustomerMaritalStatus
  address: ApiAddress
  propertyProfile: ApiCustomerPropertyProfile
  logs: ApiLog
}

type ApiCustomerPropertyProfile = {
  purchaseGoals: APICustomerPropertyProfilePurchaseGoals[]
  typeOfProperty: ApiItemLinks[]
  neighborhood: ApiItemLinks[]
  bedrooms: APICustomerPropertyProfileBedrooms[]
  garage: APICustomerPropertyProfileGarage[]
}

export type ApiCustomerCreateUpdate = {
  status: APICustomerStatus
  name: string
  phone?: string | null
  email?: string | null
  rg?: string
  cpf?: string
  dateBirth?: string
  profession?: string
  maritalStatus: APICustomerMaritalStatus
  address: {
    postalCode?: string
    street?: string
    addressLine2?: string
    streetNumber?: string
    neighborhood?: string
    city?: string
    state?: string
  } | null
  propertyProfile: {
    purchaseGoals?: APICustomerPropertyProfilePurchaseGoals[]
    neighborhood?: { id: string }[]
    typeOfProperty?: { id: string }[]
    bedrooms?: APICustomerPropertyProfileBedrooms[]
    garage?: APICustomerPropertyProfileGarage[]
  }
}
