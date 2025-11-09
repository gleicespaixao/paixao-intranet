/* eslint-disable react-hooks/exhaustive-deps */
import type { ApiCustomer } from '@/@types/api-customer'
import { getList } from '@/services/get-list'
import { joinFilters, like, cond } from '@/services/_filters'
import { useDebouncedValue } from '@/services/_search' // seu debounce
import * as React from 'react'
import { AxiosRequestConfig } from 'axios'
import { getJson } from './_request'

export type CustomersListParams = {
  page: number
  pageSize: number
  search?: string
  searchFields?: string[]
  fixedFilters?: string[]
  fixedConds?: Array<{ field: string; op: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'lk'; value: unknown }>
  signal?: AbortSignal
}

export async function getCustomerById(id: string, config?: AxiosRequestConfig) {
  return getJson<ApiCustomer>(`/Customer/${id}`, config)
}

export async function fetchCustomers({
  page,
  pageSize,
  search,
  searchFields = ['name', 'email', 'phone'],
  fixedFilters = [],
  fixedConds = [],
  signal
}: CustomersListParams) {
  const searchFilter = like(searchFields as string[], search)
  const typedFixed = fixedConds.map((f) => cond(f.field, f.op, f.value))
  const filter = joinFilters([...fixedFilters, ...typedFixed, searchFilter])

  return getList<ApiCustomer>('/Customer', { page, pageSize, filter }, { signal })
}

export function useCustomersList(params: Omit<CustomersListParams, 'signal'>) {
  const { page, pageSize, search = '', searchFields, fixedFilters, fixedConds } = params
  const debounced = useDebouncedValue(search, 300)

  const [rows, setRows] = React.useState<ApiCustomer[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const ac = new AbortController()
    setLoading(true)
    ;(async () => {
      const res = await fetchCustomers({
        page,
        pageSize,
        search: debounced,
        searchFields,
        fixedFilters,
        fixedConds,
        signal: ac.signal
      })
      if (ac.signal.aborted) return

      if (res.success && res.data) {
        const api = res.data
        setRows(api.records)
        setTotalCount(api.totalRecords ?? api.records.length)
      } else {
        setRows([])
        setTotalCount(0)
      }
      setLoading(false)
    })()

    return () => ac.abort()
  }, [
    page,
    pageSize,
    debounced,
    (searchFields ?? []).join('|'),
    JSON.stringify(fixedFilters ?? []),
    JSON.stringify(fixedConds ?? [])
  ])

  return { rows, totalCount, loading }
}
