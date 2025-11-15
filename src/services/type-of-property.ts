/* eslint-disable react-hooks/exhaustive-deps */
import { getList } from '@/services/get-list'
import { joinFilters, like, cond } from '@/services/_filters'
import { useDebouncedValue } from '@/services/_search' // seu debounce
import * as React from 'react'
import { AxiosRequestConfig } from 'axios'
import { getJson } from './_request'
import { ApiTypeOfProperty } from '@/@types/api-type-of-property'

export type TypeOfPropertyListParams = {
  page?: number
  pageSize?: number
  search?: string
  searchFields?: string[]
  fixedFilters?: string[]
  fixedConds?: Array<{ field: string; op: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'lk'; value: unknown }>
  signal?: AbortSignal
}

export async function getTypeOfPropertyById(id: string, config?: AxiosRequestConfig) {
  return getJson<ApiTypeOfProperty>(`/TypeOfProperty/${id}`, config)
}

export async function fetchTypeOfProperty({
  page = 1,
  pageSize = 100,
  search,
  searchFields = ['name', 'email', 'phone'],
  fixedFilters = [],
  fixedConds = [],
  signal
}: TypeOfPropertyListParams) {
  const searchFilter = like(searchFields as string[], search)
  const typedFixed = fixedConds.map((f) => cond(f.field, f.op, f.value))
  const filter = joinFilters([...fixedFilters, ...typedFixed, searchFilter])

  return getList<ApiTypeOfProperty>('/TypeOfProperty', { page, pageSize, filter }, { signal })
}

export function useTypeOfPropertyList(params: Omit<TypeOfPropertyListParams, 'signal'>) {
  const { page, pageSize, search = '', searchFields, fixedFilters, fixedConds } = params
  const debounced = useDebouncedValue(search, 300)

  const [rows, setRows] = React.useState<ApiTypeOfProperty[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const ac = new AbortController()
    setLoading(true)
    ;(async () => {
      const res = await fetchTypeOfProperty({
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
