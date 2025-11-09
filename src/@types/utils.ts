export type ApiItemLinks = {
  id: string
  token: number
  name: string
}

export type ApiLog = {
  inclusion: ApiInfoLog
  editing?: ApiInfoLog
}
type ApiInfoLog = {
  date: string
  user: ApiUserLogs
}

type ApiUserLogs = {
  id: string
  name: string
}
