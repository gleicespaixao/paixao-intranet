/* eslint-disable react-hooks/exhaustive-deps */
import type { ApiCustomer, ApiCustomerCreateUpdate } from '@/@types/api-customer'
import { getList } from '@/services/get-list'
import { joinFilters, like, cond } from '@/services/_filters'
import { useDebouncedValue } from '@/services/_search' // seu debounce
import * as React from 'react'
import { AxiosRequestConfig } from 'axios'
import { addJson, deleteJson, getJson, updateJson } from './_request'
import { CustomerForm } from '@/schemas/customer'

export type CustomersListParams = {
  page?: number
  pageSize?: number
  search?: string
  searchFields?: string[]
  fixedFilters?: string[]
  fixedConds?: Array<{ field: string; op: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'lk'; value: unknown }>
  signal?: AbortSignal
  reloadKey?: number
}

const hasAnyAddressField = (address: CustomerForm['address']) => {
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

const toApiCustomerPayload = (form: CustomerForm): ApiCustomerCreateUpdate => {
  const hasAddress = hasAnyAddressField(form.address)

  return {
    status: form.status,
    name: form.name,
    phone: form.phone?.replace(/\D/g, '') != '' ? form.phone : null,
    email: form.email != '' ? form.email : null,
    rg: form.rg,
    cpf: form.cpf?.replace(/\D/g, ''),
    dateBirth: form.dateBirth?.toISOString().slice(0, 10), // "YYYY-MM-DD"
    profession: form.profession ?? '',
    maritalStatus: form.maritalStatus,
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
      : null,
    propertyProfile: {
      purchaseGoals:
        form.propertyProfile.purchaseGoals && form.propertyProfile.purchaseGoals.length > 0
          ? form.propertyProfile.purchaseGoals.map((g) => g.value)
          : ['none'],
      neighborhood: form.propertyProfile.neighborhood.map((n) => ({ id: n.value })),
      typeOfProperty: form.propertyProfile.typeOfProperty.map((t) => ({ id: t.value })),
      bedrooms:
        form.propertyProfile.bedrooms && form.propertyProfile.bedrooms.length > 0
          ? form.propertyProfile.bedrooms.map((g) => g.value)
          : ['none'],
      garage:
        form.propertyProfile.garage && form.propertyProfile.garage.length > 0
          ? form.propertyProfile.garage.map((g) => g.value)
          : ['none']
    }
  }
}

export async function getCustomerById(id: string, config?: AxiosRequestConfig) {
  return getJson<ApiCustomer>(`/Customer/${id}`, config)
}

export async function addCustomer(form: CustomerForm) {
  const payload = toApiCustomerPayload(form)
  return addJson<ApiCustomer>('/Customer', payload)
}

export async function updateCustomer(id: string, form: CustomerForm) {
  const payload = toApiCustomerPayload(form)
  return updateJson<ApiCustomer>(`/Customer/${id}`, payload)
}

export async function deleteCustomer(id: string) {
  return deleteJson<ApiCustomer>(`/Customer/${id}`)
}

export async function fetchCustomers({
  page = 1,
  pageSize = 100,
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
  const { page, pageSize, search = '', searchFields, fixedFilters, fixedConds, reloadKey } = params
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
    JSON.stringify(fixedConds ?? []),
    reloadKey
  ])

  return { rows, totalCount, loading }
}
