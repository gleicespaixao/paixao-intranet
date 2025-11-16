/* eslint-disable react-hooks/exhaustive-deps */

import { getList } from '@/services/get-list'
import { joinFilters, like, cond } from '@/services/_filters'
import { useDebouncedValue } from '@/services/_search' // seu debounce
import * as React from 'react'
import { AxiosRequestConfig } from 'axios'
import { addJson, deleteJson, getJson, updateJson } from './_request'
import { ApiPurchaseHistory, ApiPurchaseHistoryCreateUpdate } from '@/@types/api-purchase-history'
import { PurchaseHistoryForm } from '@/schemas/purchase-history'

export type PurchaseHistoryListParams = {
  page: number
  pageSize: number
  search?: string
  searchFields?: string[]
  fixedFilters?: string[]
  fixedConds?: Array<{ field: string; op: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'lk'; value: unknown }>
  signal?: AbortSignal
  reloadKey?: number
}

const parseCurrencyToNumber = (value: unknown): number => {
  if (typeof value === 'number') return value
  if (typeof value !== 'string') return 0

  // mantém só dígitos, vírgula e ponto (e hífen)
  let clean = value.replace(/[^\d.,-]/g, '')
  if (!clean) return 0

  const hasComma = clean.includes(',')
  const hasDot = clean.includes('.')

  if (hasComma && hasDot) {
    // ex.: "3.500,01" → "." milhar, "," decimal
    clean = clean.replace(/\./g, '').replace(',', '.')
    return Number(clean)
  }

  if (hasComma && !hasDot) {
    // ex.: "3500,01" → "," decimal
    clean = clean.replace(',', '.')
    return Number(clean)
  }

  // só ponto ou só dígitos: deixa o Number cuidar
  // ex.: "3500.01" ou "3500"
  return Number(clean)
}

const toApiPurchaseHistoryPayload = (form: PurchaseHistoryForm): ApiPurchaseHistoryCreateUpdate => {
  const amountNumber = parseCurrencyToNumber(form.amount)
  const ownerCustomer =
    form.ownerCustomer?.map((oc) => ({
      id: oc.customer?.value ?? '',
      percentage: typeof oc.percentage === 'number' ? oc.percentage * 100 : Number(oc.percentage * 100) || 0
    })) ?? []

  // remove entradas sem id (linha vazia)
  const filteredOwnerCustomer = ownerCustomer.filter((oc) => oc.id)

  return {
    ownerCustomer: filteredOwnerCustomer,
    development: {
      id: form.development.value
    },
    unit: form.unit,
    floorPlan: form.floorPlan,
    amount: Number.isNaN(amountNumber) ? 0 : amountNumber
  }
}

export async function getPurchaseHistoryById(id: string, config?: AxiosRequestConfig) {
  return getJson<ApiPurchaseHistory>(`/PurchaseHistory/${id}`, config)
}

export async function addPurchaseHistory(form: PurchaseHistoryForm) {
  const payload = toApiPurchaseHistoryPayload(form)
  return addJson<ApiPurchaseHistory>('/PurchaseHistory', payload)
}

export async function updatePurchaseHistory(id: string, form: PurchaseHistoryForm) {
  const payload = toApiPurchaseHistoryPayload(form)
  return updateJson<ApiPurchaseHistory>(`/PurchaseHistory/${id}`, payload)
}

export async function deletePurchaseHistory(id: string) {
  return deleteJson<ApiPurchaseHistory>(`/PurchaseHistory/${id}`)
}

export async function fetchPurchaseHistory({
  page,
  pageSize,
  search,
  searchFields = ['development.name', 'unit', 'floorPlan', 'amount'],
  fixedFilters = [],
  fixedConds = [],
  signal
}: PurchaseHistoryListParams) {
  const searchFilter = like(searchFields as string[], search)
  const typedFixed = fixedConds.map((f) => cond(f.field, f.op, f.value))
  const filter = joinFilters([...fixedFilters, ...typedFixed, searchFilter])

  return getList<ApiPurchaseHistory>('/PurchaseHistory', { page, pageSize, filter }, { signal })
}

export function usePurchaseHistoryList(params: Omit<PurchaseHistoryListParams, 'signal'>) {
  const { page, pageSize, search = '', searchFields, fixedFilters, fixedConds, reloadKey } = params
  const debounced = useDebouncedValue(search, 300)

  const [rows, setRows] = React.useState<ApiPurchaseHistory[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const ac = new AbortController()
    setLoading(true)
    ;(async () => {
      const res = await fetchPurchaseHistory({
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
