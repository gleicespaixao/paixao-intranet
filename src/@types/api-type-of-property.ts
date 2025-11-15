import { ApiLog } from './utils'

export type ApiTypeOfProperty = {
  id: string
  token: number
  status: boolean
  name: string
  logs: ApiLog
}
