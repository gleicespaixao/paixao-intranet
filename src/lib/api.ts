import axios from 'axios'
import { envConfig } from './env'

export const api = axios.create({
  baseURL: envConfig.apiBaseUrl,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-type': 'application/json',
    'X-Platform-Token': envConfig.xPlatformToken
  },
  withCredentials: true
})
