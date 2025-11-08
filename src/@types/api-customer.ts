import { ApiItemLinks } from './utils'

export type ApiCustomer = {
  id: string
  token: number
  name: string
  phone: string
  email: string
  rg: string
  cpf: string
  dateBirth: string
  profession: string
  maritalStatus: 'single' | 'married' | 'separated' | 'widowed' | 'other'
  spouse: ApiCustomerSpouse
  company: ApiCustomerCompany[]
  address: ApiCustomerAddress
  propertyProfile: ApiCustomerPropertyProfile
  purchaseHistory: ApiCustomerPurchaseHistory
}

type ApiCustomerSpouse = {
  name: string
  phone: string
  email: string
  rg: string
  cpf: string
  profession: string
  marriageDate: string
}

type ApiCustomerCompany = {
  name: string
  phone: string
  email: string
  cnpj: string
  address: ApiCustomerAddress
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
  purchaseGoals: 'none' | 'residence' | 'investment'
  typeOfProperty: ApiItemLinks[]
  neighborhood: ApiItemLinks[]
  bedrooms: 'none' | 'one' | 'two' | 'three' | 'four_plus'
  garage: 'none' | 'one' | 'two' | 'three' | 'four_plus'
}

type ApiCustomerPurchaseHistory = {
  development: ApiItemLinks
  unit: string
  floorPlan: string
  amount: number
}
