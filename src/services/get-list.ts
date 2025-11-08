import { api } from '@/lib/api'
import { getApiErrorMessage } from '@/lib/http-error'
import { ApiListResponse, Result } from '@/@types/api-list'
import { AxiosRequestConfig } from 'axios'

type ListParams = {
  page: number
  pageSize?: number
  filter?: string
  orderBy?: string
}

/** GET genérico para endpoints "GetAll" (pageNumber/pageSize/filter/orderBy) */
export async function getList<T>(
  url: string,
  { page, pageSize = 50, filter, orderBy }: ListParams,
  config?: AxiosRequestConfig<unknown>
): Promise<Result<ApiListResponse<T>>> {
  try {
    const { data } = await api.get<ApiListResponse<T>>(url, {
      ...config,
      params: {
        pageNumber: page,
        pageSize,
        filter,
        orderBy
      }
    })
    return { success: true, data }
  } catch (err) {
    const { message, status } = getApiErrorMessage(err)
    return { success: false, error: message, status }
  }
}
