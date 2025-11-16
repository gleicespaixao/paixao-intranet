import { ApiItemLinks, ApiLog } from './utils'

export type ApiPurchaseHistory = {
  id: string
  token: number
  ownerCustomer?: ApiPurchaseHistoryOwnerCustomer[]
  development: ApiItemLinks
  unit: string
  floorPlan: string
  amount: number
  logs: ApiLog
}

type ApiPurchaseHistoryOwnerCustomer = ApiItemLinks & {
  percentage: number
}

export type ApiPurchaseHistoryCreateUpdate = {
  ownerCustomer: { id: string; percentage: number }[]
  development: { id: string }
  unit?: string | null
  floorPlan?: string | null
  amount: number
}
