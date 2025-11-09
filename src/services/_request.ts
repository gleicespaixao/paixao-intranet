import { api } from '@/lib/api'
import { getApiErrorMessage } from '@/lib/http-error'
import { ok, fail, ServiceResult } from './_result'
import type { AxiosRequestConfig } from 'axios'

export async function getJson<T>(url: string, config?: AxiosRequestConfig): Promise<ServiceResult<T>> {
  try {
    const { data } = await api.get<T>(url, config)
    return ok(data)
  } catch (err) {
    const { message, status } = getApiErrorMessage(err)
    return fail(message, status)
  }
}
