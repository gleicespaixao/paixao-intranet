'use client'

import * as React from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge, Card, HStack, IconButton } from '@chakra-ui/react'
import { ColumnDef, ListingTable } from '@/components/listing-table'
import { Tooltip } from '@/components/ui/tooltip'
import { BiPencil } from 'react-icons/bi'
import { getStatusMeta } from '@/utils/status'
import { ApiDevelopment } from '@/@types/api-development'
import { useDevelopmentList } from '@/services/development'
import NextLink from 'next/link'

type Row = {
  id: string
  token: number
  name: string
  neighborhood: string
  realEstateDeveloper: string[]
  status: boolean
}

export const ModuleDevelopment = ({ title }: { title: string }) => {
  const entity = 'projeto'

  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(25)
  const [search, setSearch] = React.useState('')

  const {
    rows: apiRows,
    totalCount,
    loading
  } = useDevelopmentList({
    page,
    pageSize,
    search,
    searchFields: ['name', 'neighborhood.name', 'realEstateDeveloper.name']
  })

  // mapeia para o shape da tabela
  const rows: Row[] = React.useMemo(
    () =>
      apiRows.map((r: ApiDevelopment) => ({
        id: r.id,
        token: r.token,
        name: r.name ?? '',
        status: r.status,
        neighborhood: r.address?.neighborhood ?? '',
        realEstateDeveloper: r.realEstateDeveloper?.map((d) => d.name ?? '').filter(Boolean) ?? []
      })),
    [apiRows]
  )

  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      { header: 'ID', accessorKey: 'token' },
      { header: 'Nome', accessorKey: 'name' },
      { header: 'Bairro', accessorKey: 'neighborhood' },
      {
        id: 'realEstateDeveloper',
        header: 'Incorporadora',
        cell: (row) => (
          <HStack gap={1} wrap="wrap">
            {row.realEstateDeveloper.map((name) => (
              <Badge key={name} variant="subtle">
                {name}
              </Badge>
            ))}
          </HStack>
        )
      },
      {
        id: 'status',
        header: 'Status',
        cell: (r) => {
          const { label, colorPalette } = getStatusMeta(r.status)
          return <Badge colorPalette={colorPalette}>{label}</Badge>
        }
      },
      {
        id: 'actions',
        header: 'Ações',
        align: 'right',
        cell: (row) => (
          <HStack gap={2} justify="flex-end">
            <Tooltip content="Editar" openDelay={300}>
              <NextLink href={`development/edit/${row.id}`}>
                <IconButton aria-label="Editar" size="sm" variant="subtle">
                  <BiPencil />
                </IconButton>
              </NextLink>
            </Tooltip>
          </HStack>
        )
      }
    ],
    []
  )

  // resetar para página 1 quando o termo de busca mudar
  React.useEffect(() => {
    setPage(1)
  }, [search])

  return (
    <>
      <PageHeader title={title} subtitle="Listagem de projetos registrados" backButton />

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
            includeHref="development/new"
          />
        </Card.Body>
      </Card.Root>
    </>
  )
}
