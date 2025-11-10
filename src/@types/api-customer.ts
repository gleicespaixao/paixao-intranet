import { ApiAddress, ApiLog } from './utils'

import { ApiItemLinks } from './utils'
export type APICustomerStatus = 'active' | 'inactive' | 'paused'
export type APICustomerMaritalStatus = 'single' | 'married' | 'separated' | 'widowed' | 'other'
export type APICustomerPropertyProfilePurchaseGoals = 'none' | 'residence' | 'investment'
export type APICustomerPropertyProfileBedrooms = 'none' | 'one' | 'two' | 'three' | 'four_plus'
export type APICustomerPropertyProfileGarage = 'none' | 'one' | 'two' | 'three' | 'four_plus'

export type ApiCustomer = {
  id: string
  status: APICustomerStatus
  token: number
  name: string
  phone: string
  email: string
  rg: string
  cpf: string
  dateBirth: string
  profession: string
  maritalStatus: APICustomerMaritalStatus
  address: ApiAddress
  propertyProfile: ApiCustomerPropertyProfile
  logs: ApiLog
}
type ApiCustomerPropertyProfile = {
  purchaseGoals: APICustomerPropertyProfilePurchaseGoals
  typeOfProperty: ApiItemLinks[]
  neighborhood: ApiItemLinks[]
  bedrooms: APICustomerPropertyProfileBedrooms
  garage: APICustomerPropertyProfileGarage
}
