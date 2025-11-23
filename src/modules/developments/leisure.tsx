'use client'

import * as React from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge, Card, HStack, IconButton } from '@chakra-ui/react'
import { ColumnDef, ListingTable } from '@/components/listing-table'
import { Tooltip } from '@/components/ui/tooltip'
import { BiPencil } from 'react-icons/bi'
import { ApiLeisure } from '@/@types/api-leisure'
import { useLeisureList } from '@/services/leisure'
import { LeisureDialogForm } from '@/components/dialog/leisure-dialog-form'
import { getStatusMeta } from '@/utils/status'

type Row = { id: string; token: number; name: string; status: boolean }

export const ModuleLeisure = ({ title }: { title: string }) => {
  const entity = 'lazer'

  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(25)
  const [search, setSearch] = React.useState('')

  // 👇 chave para forçar reload da lista
  const [reloadKey, setReloadKey] = React.useState(0)

  // 👇 ESTADO PARA O DIALOG
  const [open, setOpen] = React.useState(false)
  const [selectedLeisure, setSelectedLeisure] = React.useState<ApiLeisure | undefined>(undefined)

  const {
    rows: apiRows,
    totalCount,
    loading
  } = useLeisureList({
    page,
    pageSize,
    search,
    searchFields: ['name'],
    reloadKey
  })

  // mapeia para o shape da tabela
  const rows: Row[] = React.useMemo(
    () =>
      apiRows.map((r: ApiLeisure) => ({
        id: r.id,
        token: r.token,
        name: r.name ?? '',
        status: r.status
      })),
    [apiRows]
  )

  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      { header: 'ID', accessorKey: 'token' },
      { header: 'Nome', accessorKey: 'name' },
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
                    setSelectedLeisure(rel)
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
      <PageHeader title={title} subtitle="Listagem de lazeres registrados" backButton />

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
              setSelectedLeisure(undefined)
              setOpen(true)
            }}
            male={false}
          />
        </Card.Body>
      </Card.Root>
      {/* Drawer de cliente (modo create) */}
      <LeisureDialogForm
        open={open}
        onOpenChange={setOpen}
        mode={selectedLeisure ? 'edit' : 'create'}
        initial={selectedLeisure}
        onSuccess={async () => {
          setReloadKey((k) => k + 1)
          setOpen(false)
        }}
      />
    </>
  )
}
