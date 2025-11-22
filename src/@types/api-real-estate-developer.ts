import { ApiLog } from './utils'

export type ApiRealEstateDeveloper = {
  id: string
  token: number
  status: boolean
  name: string
  logs: ApiLog
}

export type ApiRealEstateDeveloperCreateUpdate = {
  status: boolean
  name: string
}
