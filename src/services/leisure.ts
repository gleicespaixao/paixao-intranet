/* eslint-disable react-hooks/exhaustive-deps */
import { getList } from '@/services/get-list'
import { joinFilters, like, cond } from '@/services/_filters'
import { useDebouncedValue } from '@/services/_search' // seu debounce
import * as React from 'react'
import { AxiosRequestConfig } from 'axios'
import { addJson, deleteJson, getJson, updateJson } from './_request'
import { ApiLeisure, ApiLeisureCreateUpdate } from '@/@types/api-leisure'
import { LeisureForm } from '@/schemas/leisure'

export type LeisureListParams = {
  page?: number
  pageSize?: number
  search?: string
  searchFields?: string[]
  fixedFilters?: string[]
  fixedConds?: Array<{ field: string; op: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'lk'; value: unknown }>
  signal?: AbortSignal
  reloadKey?: number
}

const toApiLeisurePayload = (form: LeisureForm): ApiLeisureCreateUpdate => {
  return {
    status: form.status === 'active' ? true : false,
    name: form.name
  }
}

export async function getLeisureById(id: string, config?: AxiosRequestConfig) {
  return getJson<ApiLeisure>(`/Leisure/${id}`, config)
}

export async function addLeisure(form: LeisureForm) {
  const payload = toApiLeisurePayload(form)
  return addJson<ApiLeisure>('/Leisure', payload)
}

export async function updateLeisure(id: string, form: LeisureForm) {
  const payload = toApiLeisurePayload(form)
  return updateJson<ApiLeisure>(`/Leisure/${id}`, payload)
}

export async function deleteLeisure(id: string) {
  return deleteJson<ApiLeisure>(`/Leisure/${id}`)
}

export async function fetchLeisure({
  page = 1,
  pageSize = 100,
  search,
  searchFields = ['name', 'email', 'phone'],
  fixedFilters = [],
  fixedConds = [],
  signal
}: LeisureListParams) {
  const searchFilter = like(searchFields as string[], search)
  const typedFixed = fixedConds.map((f) => cond(f.field, f.op, f.value))
  const filter = joinFilters([...fixedFilters, ...typedFixed, searchFilter])

  return getList<ApiLeisure>('/Leisure', { page, pageSize, filter }, { signal })
}

export function useLeisureList(params: Omit<LeisureListParams, 'signal'>) {
  const { page, pageSize, search = '', searchFields, fixedFilters, fixedConds, reloadKey } = params
  const debounced = useDebouncedValue(search, 300)

  const [rows, setRows] = React.useState<ApiLeisure[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const ac = new AbortController()
    setLoading(true)
    ;(async () => {
      const res = await fetchLeisure({
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
