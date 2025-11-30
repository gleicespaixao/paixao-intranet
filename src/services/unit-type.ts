/* eslint-disable react-hooks/exhaustive-deps */
import { getList } from '@/services/get-list'
import { joinFilters, like, cond } from '@/services/_filters'
import { useDebouncedValue } from '@/services/_search' // seu debounce
import * as React from 'react'
import { AxiosRequestConfig } from 'axios'
import { addJson, deleteJson, getJson, updateJson } from './_request'
import { ApiUnitType, ApiUnitTypeCreateUpdate } from '@/@types/api-unit-type'
import { UnitTypeForm } from '@/schemas/unit-type'

export type UnitTypeListParams = {
  page?: number
  pageSize?: number
  search?: string
  searchFields?: string[]
  fixedFilters?: string[]
  fixedConds?: Array<{ field: string; op: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'lk'; value: unknown }>
  signal?: AbortSignal
  reloadKey?: number
}

const toApiUnitTypePayload = (form: UnitTypeForm): ApiUnitTypeCreateUpdate => {
  return {
    status: form.status === 'active' ? true : false,
    name: form.name
  }
}

export async function getUnitTypeById(id: string, config?: AxiosRequestConfig) {
  return getJson<ApiUnitType>(`/UnitType/${id}`, config)
}

export async function addUnitType(form: UnitTypeForm) {
  const payload = toApiUnitTypePayload(form)
  return addJson<ApiUnitType>('/UnitType', payload)
}

export async function updateUnitType(id: string, form: UnitTypeForm) {
  const payload = toApiUnitTypePayload(form)
  return updateJson<ApiUnitType>(`/UnitType/${id}`, payload)
}

export async function deleteUnitType(id: string) {
  return deleteJson<ApiUnitType>(`/UnitType/${id}`)
}

export async function fetchUnitType({
  page = 1,
  pageSize = 100,
  search,
  searchFields = ['name', 'email', 'phone'],
  fixedFilters = [],
  fixedConds = [],
  signal
}: UnitTypeListParams) {
  const searchFilter = like(searchFields as string[], search)
  const typedFixed = fixedConds.map((f) => cond(f.field, f.op, f.value))
  const filter = joinFilters([...fixedFilters, ...typedFixed, searchFilter])

  return getList<ApiUnitType>('/UnitType', { page, pageSize, filter }, { signal })
}

export function useUnitTypeList(params: Omit<UnitTypeListParams, 'signal'>) {
  const { page, pageSize, search = '', searchFields, fixedFilters, fixedConds, reloadKey } = params
  const debounced = useDebouncedValue(search, 300)

  const [rows, setRows] = React.useState<ApiUnitType[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const ac = new AbortController()
    setLoading(true)
    ;(async () => {
      const res = await fetchUnitType({
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
