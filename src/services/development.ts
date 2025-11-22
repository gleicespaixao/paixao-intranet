/* eslint-disable react-hooks/exhaustive-deps */

import { getList } from '@/services/get-list'
import { joinFilters, like, cond } from '@/services/_filters'
import { useDebouncedValue } from '@/services/_search' // seu debounce
import * as React from 'react'
import { AxiosRequestConfig } from 'axios'
import { addJson, deleteJson, getJson, updateJson } from './_request'
import { ApiDevelopment, ApiDevelopmentCreateUpdate } from '@/@types/api-development'
import { DevelopmentForm } from '@/schemas/development'

export type DevelopmentListParams = {
  page?: number
  pageSize?: number
  search?: string
  searchFields?: string[]
  fixedFilters?: string[]
  fixedConds?: Array<{ field: string; op: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'lk'; value: unknown }>
  signal?: AbortSignal
  reloadKey?: number
}

const toApiDevelopmentPayload = (form: DevelopmentForm): ApiDevelopmentCreateUpdate => {
  return {
    status: form.status === 'active' ? true : false,
    name: form.name,
    neighborhood: {
      id: form.neighborhood.value
    },
    realEstateDeveloper: form.realEstateDeveloper
  }
}

export async function getDevelopmentById(id: string, config?: AxiosRequestConfig) {
  return getJson<ApiDevelopment>(`/Development/${id}`, config)
}

export async function addDevelopment(form: DevelopmentForm) {
  const payload = toApiDevelopmentPayload(form)
  return addJson<ApiDevelopment>('/Development', payload)
}

export async function updateDevelopment(id: string, form: DevelopmentForm) {
  const payload = toApiDevelopmentPayload(form)
  return updateJson<ApiDevelopment>(`/Development/${id}`, payload)
}

export async function deleteDevelopment(id: string) {
  return deleteJson<ApiDevelopment>(`/Development/${id}`)
}

export async function fetchDevelopment({
  page = 1,
  pageSize = 100,
  search,
  searchFields = ['development.name', 'unit', 'floorPlan', 'amount'],
  fixedFilters = [],
  fixedConds = [],
  signal
}: DevelopmentListParams) {
  const searchFilter = like(searchFields as string[], search)
  const typedFixed = fixedConds.map((f) => cond(f.field, f.op, f.value))
  const filter = joinFilters([...fixedFilters, ...typedFixed, searchFilter])

  return getList<ApiDevelopment>('/Development', { page, pageSize, filter }, { signal })
}

export function useDevelopmentList(params: Omit<DevelopmentListParams, 'signal'>) {
  const { page, pageSize, search = '', searchFields, fixedFilters, fixedConds, reloadKey } = params
  const debounced = useDebouncedValue(search, 300)

  const [rows, setRows] = React.useState<ApiDevelopment[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const ac = new AbortController()
    setLoading(true)
    ;(async () => {
      const res = await fetchDevelopment({
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
