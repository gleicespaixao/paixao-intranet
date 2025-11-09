import { ApiLog } from './utils'

import { ApiItemLinks } from './utils'
export type CustomerStatus = 'active' | 'inactive' | 'paused'
export type CustomermMaritalStatus = 'single' | 'married' | 'separated' | 'widowed' | 'other'
export type CustomermPropertyProfilePurchaseGoals = 'none' | 'residence' | 'investment'
export type CustomermPropertyProfileBedrooms = 'none' | 'one' | 'two' | 'three' | 'four_plus'
export type CustomermPropertyProfileGarage = 'none' | 'one' | 'two' | 'three' | 'four_plus'

export type ApiCustomer = {
  id: string
  status: CustomerStatus
  token: number
  name: string
  phone: string
  email: string
  rg: string
  cpf: string
  dateBirth: string
  profession: string
  maritalStatus: CustomermMaritalStatus
  address: ApiCustomerAddress
  propertyProfile: ApiCustomerPropertyProfile
  logs: ApiLog
}

type ApiCustomerAddress = {
  postalCode: number
  street: string
  addressLine: string
  streetNumber: string
  neighborhood: string
  city: string
  state: string
}

type ApiCustomerPropertyProfile = {
  purchaseGoals: CustomermPropertyProfilePurchaseGoals
  typeOfProperty: ApiItemLinks[]
  neighborhood: ApiItemLinks[]
  bedrooms: CustomermPropertyProfileBedrooms
  garage: CustomermPropertyProfileGarage
}

// type ApiCustomerSpouse = {
//   name: string
//   phone: string
//   email: string
//   rg: string
//   cpf: string
//   profession: string
//   marriageDate: string
// }

// type ApiCustomerCompany = {
//   name: string
//   phone: string
//   email: string
//   cnpj: string
//   address: ApiCustomerAddress
// }
