import { ApiItemLinks, ApiLog } from './utils'

export type ApiPurchaseHistory = {
  id: string
  token: number
  ownerCustomer: ApiPurchaseHistoryOwnerCustomer[]
  development: ApiItemLinks
  unit: string
  floorPlan: string
  amount: number
  logs: ApiLog
}

type ApiPurchaseHistoryOwnerCustomer = ApiItemLinks & {
  percentage: number
}
