/* eslint-disable react-hooks/exhaustive-deps */

import { getList } from '@/services/get-list'
import { joinFilters, like, cond } from '@/services/_filters'
import { useDebouncedValue } from '@/services/_search' // seu debounce
import * as React from 'react'
import { AxiosRequestConfig } from 'axios'
import { addJson, deleteJson, getJson, updateJson } from './_request'
import { ApiCompany, ApiCompanyCreateUpdate } from '@/@types/api-company'
import { CompanyForm } from '@/schemas/company'

export type CompanyListParams = {
  page: number
  pageSize: number
  search?: string
  searchFields?: string[]
  fixedFilters?: string[]
  fixedConds?: Array<{ field: string; op: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'lk'; value: unknown }>
  signal?: AbortSignal
  reloadKey?: number
}

const hasAnyAddressField = (address: CompanyForm['address']) => {
  if (!address) return false

  return (
    !!address.postalCode?.trim() ||
    !!address.street?.trim() ||
    !!address.addressLine?.trim() ||
    !!address.streetNumber?.trim() ||
    !!address.neighborhood?.trim() ||
    !!address.city?.trim() ||
    !!address.state?.trim()
  )
}

const toApiCompanyPayload = (form: CompanyForm): ApiCompanyCreateUpdate => {
  const hasAddress = hasAnyAddressField(form.address)
  return {
    name: form.name,
    phone: form.phone?.replace(/\D/g, '') != '' ? form.phone : null,
    email: form.email != '' ? form.email : null,
    cnpj: form.cnpj?.replace(/\D/g, ''),
    address: hasAddress
      ? {
          postalCode: form.address.postalCode?.replace(/\D/g, '') ?? '0',
          street: form.address.street,
          addressLine2: form.address.addressLine,
          streetNumber: form.address.streetNumber,
          neighborhood: form.address.neighborhood,
          city: form.address.city,
          state: form.address.state
        }
      : null
  }
}

export async function getCompanyById(id: string, config?: AxiosRequestConfig) {
  return getJson<ApiCompany>(`/Company/${id}`, config)
}

export async function addCompany(form: CompanyForm) {
  const payload = toApiCompanyPayload(form)
  return addJson<ApiCompany>('/Company', payload)
}

export async function updateCompany(id: string, form: CompanyForm) {
  const payload = toApiCompanyPayload(form)
  return updateJson<ApiCompany>(`/Company/${id}`, payload)
}

export async function addCustumerCompany(id: string, customerId: string) {
  return addJson<ApiCompany>(`/Company/${id}/customers/${customerId}`)
}

export async function removeCustumerCompany(id: string, customerId: string) {
  return deleteJson<ApiCompany>(`/Company/${id}/customers/${customerId}`)
}

export async function deleteCompany(id: string) {
  return deleteJson<ApiCompany>(`/Company/${id}`)
}

export async function fetchCompany({
  page,
  pageSize,
  search,
  searchFields = ['development.name', 'unit', 'floorPlan', 'amount'],
  fixedFilters = [],
  fixedConds = [],
  signal
}: CompanyListParams) {
  const searchFilter = like(searchFields as string[], search)
  const typedFixed = fixedConds.map((f) => cond(f.field, f.op, f.value))
  const filter = joinFilters([...fixedFilters, ...typedFixed, searchFilter])

  return getList<ApiCompany>('/Company', { page, pageSize, filter }, { signal })
}

export function useCompanyList(params: Omit<CompanyListParams, 'signal'>) {
  const { page, pageSize, search = '', searchFields, fixedFilters, fixedConds, reloadKey } = params
  const debounced = useDebouncedValue(search, 300)

  const [rows, setRows] = React.useState<ApiCompany[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const ac = new AbortController()
    setLoading(true)
    ;(async () => {
      const res = await fetchCompany({
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
