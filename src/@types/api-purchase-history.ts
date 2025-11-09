import { ApiItemLinks, ApiLog } from './utils'

export type ApiPurchaseHistory = {
  id: string
  token: number
  development: ApiItemLinks
  unit: string
  floorPlan: string
  amount: number
  logs: ApiLog
}
