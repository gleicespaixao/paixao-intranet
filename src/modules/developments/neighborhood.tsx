'use client'

import * as React from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge, Card, HStack, IconButton } from '@chakra-ui/react'
import { ColumnDef, ListingTable } from '@/components/listing-table'
import { Tooltip } from '@/components/ui/tooltip'
import { BiPencil } from 'react-icons/bi'
import { getStatusMeta } from '@/utils/status'
import { ApiNeighborhood } from '@/@types/api-neighborhood'
import { useNeighborhoodList } from '@/services/neighborhood'
import { NeighborhoodDialogForm } from '@/components/dialog/neighborhood-dialog-form'

type Row = { id: string; token: number; name: string; city: string; state: string; status: boolean }

export const ModuleNeighborhood = ({ title }: { title: string }) => {
  const entity = 'bairros'

  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(25)
  const [search, setSearch] = React.useState('')

  // 👇 chave para forçar reload da lista
  const [reloadKey, setReloadKey] = React.useState(0)

  // 👇 ESTADO PARA O DIALOG
  const [open, setOpen] = React.useState(false)
  const [selectedNeighborhood, setSelectedNeighborhood] = React.useState<ApiNeighborhood | undefined>(undefined)

  const {
    rows: apiRows,
    totalCount,
    loading
  } = useNeighborhoodList({
    page,
    pageSize,
    search,
    searchFields: ['name', 'city', 'state'],
    reloadKey
  })

  // mapeia para o shape da tabela
  const rows: Row[] = React.useMemo(
    () =>
      apiRows.map((r: ApiNeighborhood) => ({
        id: r.id,
        token: r.token,
        name: r.name ?? '',
        city: r.city ?? '',
        state: r.state ?? '',
        status: r.status
      })),
    [apiRows]
  )

  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      { header: 'ID', accessorKey: 'token' },
      { header: 'Nome', accessorKey: 'name' },
      { header: 'Cidade', accessorKey: 'city' },
      { header: 'Estado', accessorKey: 'state' },
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
              <IconButton
                aria-label="Editar"
                size="sm"
                variant="subtle"
                onClick={() => {
                  const rel = apiRows.find((r) => r.id === row.id)

                  if (rel) {
                    setSelectedNeighborhood(rel)
                    setOpen(true)
                  }
                }}
              >
                <BiPencil />
              </IconButton>
            </Tooltip>
          </HStack>
        )
      }
    ],
    [apiRows]
  )

  // resetar para página 1 quando o termo de busca mudar
  React.useEffect(() => {
    setPage(1)
  }, [search])

  return (
    <>
      <PageHeader title={title} subtitle="Listagem de bairros registrados" backButton />

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
            includeOnClick={() => {
              setSelectedNeighborhood(undefined)
              setOpen(true)
            }}
          />
        </Card.Body>
      </Card.Root>
      <NeighborhoodDialogForm
        open={open}
        onOpenChange={setOpen}
        mode={selectedNeighborhood ? 'edit' : 'create'}
        initial={selectedNeighborhood}
        onSuccess={async () => {
          setReloadKey((k) => k + 1)
          setOpen(false)
        }}
      />
    </>
  )
}
