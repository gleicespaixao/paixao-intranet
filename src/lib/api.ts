import axios from 'axios'
import { envConfig } from './env'
import { getApiAccessToken } from './token-store'

export const api = axios.create({
  baseURL: envConfig.apiBaseUrl,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-type': 'application/json',
    'X-Platform-Token': envConfig.xPlatformToken
  },
  withCredentials: true
})

api.interceptors.request.use((config) => {
  const token = getApiAccessToken()
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
