import { ApiLog } from './utils'

export type ApiNeighborhood = {
  id: string
  token: number
  status: boolean
  name: string
  city: string
  state: string
  logs: ApiLog
}
