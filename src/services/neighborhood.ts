/* eslint-disable react-hooks/exhaustive-deps */
import { getList } from '@/services/get-list'
import { joinFilters, like, cond } from '@/services/_filters'
import { useDebouncedValue } from '@/services/_search' // seu debounce
import * as React from 'react'
import { AxiosRequestConfig } from 'axios'
import { addJson, deleteJson, getJson, updateJson } from './_request'
import { ApiNeighborhood, ApiNeighborhoodCreateUpdate } from '@/@types/api-neighborhood'
import { NeighborhoodForm } from '@/schemas/neighborhood'

export type NeighborhoodListParams = {
  page?: number
  pageSize?: number
  search?: string
  searchFields?: string[]
  fixedFilters?: string[]
  fixedConds?: Array<{ field: string; op: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'lk'; value: unknown }>
  signal?: AbortSignal
  reloadKey?: number
}

const toApiNeighborhoodPayload = (form: NeighborhoodForm): ApiNeighborhoodCreateUpdate => {
  return {
    status: form.status === 'active' ? true : false,
    name: form.name,
    city: form.city,
    state: form.state
  }
}

export async function getNeighborhoodById(id: string, config?: AxiosRequestConfig) {
  return getJson<ApiNeighborhood>(`/Neighborhood/${id}`, config)
}

export async function addNeighborhood(form: NeighborhoodForm) {
  const payload = toApiNeighborhoodPayload(form)
  return addJson<ApiNeighborhood>('/Neighborhood', payload)
}

export async function updateNeighborhood(id: string, form: NeighborhoodForm) {
  const payload = toApiNeighborhoodPayload(form)
  return updateJson<ApiNeighborhood>(`/Neighborhood/${id}`, payload)
}

export async function deleteNeighborhood(id: string) {
  return deleteJson<ApiNeighborhood>(`/Neighborhood/${id}`)
}

export async function fetchNeighborhood({
  page = 1,
  pageSize = 100,
  search,
  searchFields = ['name', 'email', 'phone'],
  fixedFilters = [],
  fixedConds = [],
  signal
}: NeighborhoodListParams) {
  const searchFilter = like(searchFields as string[], search)
  const typedFixed = fixedConds.map((f) => cond(f.field, f.op, f.value))
  const filter = joinFilters([...fixedFilters, ...typedFixed, searchFilter])

  return getList<ApiNeighborhood>('/Neighborhood', { page, pageSize, filter }, { signal })
}

export function useNeighborhoodList(params: Omit<NeighborhoodListParams, 'signal'>) {
  const { page, pageSize, search = '', searchFields, fixedFilters, fixedConds, reloadKey } = params
  const debounced = useDebouncedValue(search, 300)

  const [rows, setRows] = React.useState<ApiNeighborhood[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const ac = new AbortController()
    setLoading(true)
    ;(async () => {
      const res = await fetchNeighborhood({
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
    JSON.stringify(fixedConds ?? []),
    reloadKey
  ])

  return { rows, totalCount, loading }
}
