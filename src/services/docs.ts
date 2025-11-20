/* eslint-disable react-hooks/exhaustive-deps */

import { getList } from '@/services/get-list'
import { joinFilters, like, cond } from '@/services/_filters'
import { useDebouncedValue } from '@/services/_search' // seu debounce
import * as React from 'react'
import { ApiDocs } from '@/@types/api-docs'
import { addJson, deleteJson } from './_request'
import { AxiosRequestConfig } from 'axios'

export type DocsListParams = {
  userId: string
  page: number
  pageSize: number
  search?: string
  searchFields?: string[]
  fixedFilters?: string[]
  fixedConds?: Array<{ field: string; op: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'lk'; value: unknown }>
  signal?: AbortSignal
  reloadKey?: number
}

export async function addFile(userId: string, files: File[]) {
  const formData = new FormData()

  // o nome do campo TEM que ser "files" pra bater com List<IFormFile> files
  files.forEach((file) => {
    formData.append('files', file)
  })

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }

  // agora o back retorna uma lista de arquivos
  return addJson<ApiDocs[]>(`/Customer/${userId}/file`, formData, config)
}

export async function deleteFile(userId: string, id: string) {
  return deleteJson<ApiDocs>(`/Customer/${userId}/file/${id}`)
}

export async function fetchDocs({
  userId,
  page,
  pageSize,
  search,
  searchFields = [],
  fixedFilters = [],
  fixedConds = [],
  signal
}: DocsListParams) {
  const searchFilter = like(searchFields as string[], search)
  const typedFixed = fixedConds.map((f) => cond(f.field, f.op, f.value))
  const filter = joinFilters([...fixedFilters, ...typedFixed, searchFilter])

  return getList<ApiDocs>(`/Customer/${userId}/file`, { page, pageSize, filter }, { signal })
}

export function useDocsList(params: Omit<DocsListParams, 'signal'>) {
  const { userId, page, pageSize, search = '', searchFields, fixedFilters, fixedConds, reloadKey } = params
  const debounced = useDebouncedValue(search, 300)

  const [rows, setRows] = React.useState<ApiDocs[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const ac = new AbortController()
    setLoading(true)
    ;(async () => {
      const res = await fetchDocs({
        userId,
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
