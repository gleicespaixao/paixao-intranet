'use client'

import * as React from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, HStack, IconButton } from '@chakra-ui/react'
import { ColumnDef, ListingTable } from '@/components/listing-table'
import { getList } from '@/services/get-list'
import { formatPhoneNumber } from '@/utils/format-phone-number'
import { Tooltip } from '@/components/ui/tooltip'
import { BiPen, BiShow } from 'react-icons/bi'
import NextLink from 'next/link'
import { ApiCustomer } from '@/@types/api-customer'

type Row = { id: string; name: string; phone: string; email: string }

export const ModuleCustomer = ({ title }: { title: string }) => {
  const entity = 'cliente'

  // paginação controlada
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(25)

  // busca
  const [search, setSearch] = React.useState('')

  // debounce simples (300ms)
  const [debouncedSearch, setDebouncedSearch] = React.useState(search)
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => clearTimeout(t)
  }, [search])

  // dados
  const [rows, setRows] = React.useState<Row[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)

  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      { header: 'Nome', accessorKey: 'name' },
      { header: 'Telefone', accessorKey: 'phone', cell: (r) => formatPhoneNumber(String(r.phone ?? '')) },
      { header: 'E-mail', accessorKey: 'email' },
      {
        id: 'actions',
        header: 'Ações',
        align: 'right',
        cell: (r) => (
          <HStack gap={2} justify="flex-end">
            <Tooltip content="Visualizar" openDelay={300}>
              <NextLink href={`customer/view/${r.id}`}>
                <IconButton aria-label="Visualizar" size="sm" variant="subtle">
                  <BiShow />
                </IconButton>
              </NextLink>
            </Tooltip>

            <Tooltip content="Editar" openDelay={300}>
              <NextLink href={`customer/edit/${r.id}`}>
                <IconButton aria-label="Editar" size="sm" variant="subtle">
                  <BiPen />
                </IconButton>
              </NextLink>
            </Tooltip>
          </HStack>
        )
      }
    ],
    []
  )

  React.useEffect(() => {
    const ac = new AbortController()
    setLoading(true)
    ;(async () => {
      const filter = debouncedSearch.length > 0 ? `name|email|phone lk ${debouncedSearch}` : undefined

      const res = await getList<ApiCustomer>('/customer', { page, pageSize, filter }, { signal: ac.signal })

      if (ac.signal.aborted) return

      if (res.success && res.data) {
        const api = res.data
        setTotalCount(api.totalRecords ?? api.records.length)
        const mapped: Row[] = api.records.map((r) => ({
          id: r.id,
          name: r.name ?? '',
          phone: r.phone ?? '',
          email: r.email ?? ''
        }))
        setRows(mapped)
      } else {
        setRows([])
        setTotalCount(0)
      }

      setLoading(false)
    })()

    return () => ac.abort()
  }, [page, pageSize, debouncedSearch])

  // quando o texto “bruto” muda, reseta página imediatamente
  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  return (
    <>
      <PageHeader title={title} subtitle="Listagem de clientes registrados" backButton />

      <Card.Root>
        <Card.Body p={0}>
          <ListingTable<Row>
            entity={entity}
            rows={rows}
            columns={columns}
            getRowId={(r) => r.id}
            searchValue={search}
            onSearchChange={setSearch}
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={setPage}
            onPageSizeChange={(n) => {
              setPageSize(n)
              setPage(1)
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            defaultPageSize={pageSize}
            loading={loading}
            includeHref="/customer/add"
          />
        </Card.Body>
      </Card.Root>
    </>
  )
}
