/* eslint-disable react-hooks/exhaustive-deps */

import { getList } from '@/services/get-list'
import { joinFilters, like, cond } from '@/services/_filters'
import { useDebouncedValue } from '@/services/_search' // seu debounce
import * as React from 'react'
import { AxiosRequestConfig } from 'axios'
import { addJson, deleteJson, getJson, updateJson } from './_request'
import { ApiRelationship, ApiRelationshipCreateUpdate } from '@/@types/api-relationship'
import { RelationshipForm } from '@/schemas/relationship'

export type RelationshipListParams = {
  page: number
  pageSize: number
  search?: string
  searchFields?: string[]
  fixedFilters?: string[]
  fixedConds?: Array<{ field: string; op: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'lk'; value: unknown }>
  signal?: AbortSignal
  reloadKey?: number
}

const toApiRelationshipPayload = (form: RelationshipForm, currentCustomerId?: string): ApiRelationshipCreateUpdate => {
  const customers: { id: string }[] = []

  // cliente "dono" da tela
  if (currentCustomerId) {
    customers.push({ id: currentCustomerId })
  }

  // cliente vinculado escolhido no select
  if (form.customer?.value && form.customer.value !== currentCustomerId) {
    customers.push({ id: form.customer.value })
  }
  return {
    customer: customers,
    type: form.type,
    marriageDate: form.marriageDate?.toISOString().slice(0, 10) ?? null
  }
}

export async function getRelationshipById(id: string, config?: AxiosRequestConfig) {
  return getJson<ApiRelationship>(`/Relationship/${id}`, config)
}

export async function addRelationship(form: RelationshipForm, currentCustomerId?: string) {
  const payload = toApiRelationshipPayload(form, currentCustomerId)
  return addJson<ApiRelationship>('/Relationship', payload)
}

export async function updateRelationship(id: string, form: RelationshipForm, currentCustomerId?: string) {
  const payload = toApiRelationshipPayload(form, currentCustomerId)
  return updateJson<ApiRelationship>(`/Relationship/${id}`, payload)
}

export async function deleteRelationship(id: string) {
  return deleteJson<ApiRelationship>(`/Relationship/${id}`)
}

export async function fetchRelationship({
  page,
  pageSize,
  search,
  searchFields = ['developmentname', 'unit', 'floorPlan', 'amount'],
  fixedFilters = [],
  fixedConds = [],
  signal
}: RelationshipListParams) {
  const searchFilter = like(searchFields as string[], search)
  const typedFixed = fixedConds.map((f) => cond(f.field, f.op, f.value))
  const filter = joinFilters([...fixedFilters, ...typedFixed, searchFilter])

  return getList<ApiRelationship>('/Relationship', { page, pageSize, filter }, { signal })
}

export function useRelationshipList(params: Omit<RelationshipListParams, 'signal'>) {
  const { page, pageSize, search = '', searchFields, fixedFilters, fixedConds, reloadKey } = params
  const debounced = useDebouncedValue(search, 300)

  const [rows, setRows] = React.useState<ApiRelationship[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const ac = new AbortController()
    setLoading(true)
    ;(async () => {
      const res = await fetchRelationship({
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
