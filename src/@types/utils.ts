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

export type ApiAddress = {
  postalCode: number
  street: string
  addressLine: string
  streetNumber: string
  neighborhood: string
  city: string
  state: string
}
