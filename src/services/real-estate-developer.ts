/* eslint-disable react-hooks/exhaustive-deps */
import { getList } from '@/services/get-list'
import { joinFilters, like, cond } from '@/services/_filters'
import { useDebouncedValue } from '@/services/_search' // seu debounce
import * as React from 'react'
import { AxiosRequestConfig } from 'axios'
import { addJson, deleteJson, getJson, updateJson } from './_request'
import { ApiRealEstateDeveloper, ApiRealEstateDeveloperCreateUpdate } from '@/@types/api-real-estate-developer'
import { RealEstateDeveloperForm } from '@/schemas/real-estate-developer'

export type RealEstateDeveloperListParams = {
  page?: number
  pageSize?: number
  search?: string
  searchFields?: string[]
  fixedFilters?: string[]
  fixedConds?: Array<{ field: string; op: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'lk'; value: unknown }>
  signal?: AbortSignal
  reloadKey?: number
}

const toApiRealEstateDeveloperPayload = (form: RealEstateDeveloperForm): ApiRealEstateDeveloperCreateUpdate => {
  return {
    status: form.status === 'active' ? true : false,
    name: form.name
  }
}

export async function getRealEstateDeveloperById(id: string, config?: AxiosRequestConfig) {
  return getJson<ApiRealEstateDeveloper>(`/RealEstateDeveloper/${id}`, config)
}

export async function addRealEstateDeveloper(form: RealEstateDeveloperForm) {
  const payload = toApiRealEstateDeveloperPayload(form)
  return addJson<ApiRealEstateDeveloper>('/RealEstateDeveloper', payload)
}

export async function updateRealEstateDeveloper(id: string, form: RealEstateDeveloperForm) {
  const payload = toApiRealEstateDeveloperPayload(form)
  return updateJson<ApiRealEstateDeveloper>(`/RealEstateDeveloper/${id}`, payload)
}

export async function deleteRealEstateDeveloper(id: string) {
  return deleteJson<ApiRealEstateDeveloper>(`/RealEstateDeveloper/${id}`)
}

export async function fetchRealEstateDeveloper({
  page = 1,
  pageSize = 100,
  search,
  searchFields = ['name', 'email', 'phone'],
  fixedFilters = [],
  fixedConds = [],
  signal
}: RealEstateDeveloperListParams) {
  const searchFilter = like(searchFields as string[], search)
  const typedFixed = fixedConds.map((f) => cond(f.field, f.op, f.value))
  const filter = joinFilters([...fixedFilters, ...typedFixed, searchFilter])

  return getList<ApiRealEstateDeveloper>('/RealEstateDeveloper', { page, pageSize, filter }, { signal })
}

export function useRealEstateDeveloperList(params: Omit<RealEstateDeveloperListParams, 'signal'>) {
  const { page, pageSize, search = '', searchFields, fixedFilters, fixedConds, reloadKey } = params
  const debounced = useDebouncedValue(search, 300)

  const [rows, setRows] = React.useState<ApiRealEstateDeveloper[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const ac = new AbortController()
    setLoading(true)
    ;(async () => {
      const res = await fetchRealEstateDeveloper({
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
