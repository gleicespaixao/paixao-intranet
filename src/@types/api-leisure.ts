import { ApiLog } from './utils'

export type ApiLeisure = {
  id: string
  token: number
  status: boolean
  name: string
  logs: ApiLog
}

export type ApiLeisureCreateUpdate = {
  status: boolean
  name: string
}
