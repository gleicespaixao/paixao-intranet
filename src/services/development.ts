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
const hasAnyAddressField = (address: DevelopmentForm['address']) => {
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

const toApiDevelopmentPayload = (form: DevelopmentForm): ApiDevelopmentCreateUpdate => {
  const hasAddress = hasAnyAddressField(form.address)
  const realEstateDeveloper =
    form.realEstateDeveloper?.map((dev) => ({
      id: dev.value ?? ''
    })) ?? []
  const leisure =
    form.technicalSpecifications.leisure?.map((lei) => ({
      id: lei.value ?? ''
    })) ?? []

  const distance = form.distance?.map((dis) => dis.distance?.trim() ?? '').filter((d) => d) ?? []

  // remove entradas sem id (linha vazia)
  const filteredRealEstateDeveloper = realEstateDeveloper.filter((oc) => oc.id)
  const filteredLeisure = leisure.filter((oc) => oc.id)
  return {
    status: form.status === 'active' ? true : false,
    name: form.name,
    realEstateDeveloper: filteredRealEstateDeveloper,
    phase: form.phase,
    releaseDate: form.releaseDate?.toISOString().slice(0, 10), // "YYYY-MM-DD"
    technicalSpecifications: {
      floorPlan: form.technicalSpecifications.floorPlan,
      leisure: filteredLeisure
    },
    projectTeam: {
      architecture: form.projectTeam.architecture,
      interiorDesign: form.projectTeam.interiorDesign,
      landscaping: form.projectTeam.landscaping
    },
    distance: distance,
    typology: {
      studio: {
        quantity: form.typology.studio.quantity,
        floorPlan: form.typology.studio.floorPlan
      },
      one_bedroom: {
        quantity: form.typology.one_bedroom.quantity,
        floorPlan: form.typology.one_bedroom.floorPlan
      },
      two_bedroom: {
        quantity: form.typology.two_bedroom.quantity,
        floorPlan: form.typology.two_bedroom.floorPlan
      },
      three_bedroom: {
        quantity: form.typology.three_bedroom.quantity,
        floorPlan: form.typology.three_bedroom.floorPlan
      },
      four_bedroom: {
        quantity: form.typology.four_bedroom.quantity,
        floorPlan: form.typology.four_bedroom.floorPlan
      }
    },
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
