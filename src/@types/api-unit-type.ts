import { ApiLog } from './utils'

export type ApiUnitType = {
  id: string
  token: number
  status: boolean
  name: string
  logs: ApiLog
}

export type ApiUnitTypeCreateUpdate = {
  status: boolean
  name: string
}
