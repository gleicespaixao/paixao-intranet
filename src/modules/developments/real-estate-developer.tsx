'use client'

import * as React from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge, Card, HStack, IconButton } from '@chakra-ui/react'
import { ColumnDef, ListingTable } from '@/components/listing-table'
import { Tooltip } from '@/components/ui/tooltip'
import { BiPencil } from 'react-icons/bi'
import { ApiRealEstateDeveloper } from '@/@types/api-real-estate-developer'
import { useRealEstateDeveloperList } from '@/services/real-estate-developer'
import { RealEstateDeveloperDialogForm } from '@/components/dialog/real-estate-developer-dialog-form'
import { getStatusMeta } from '@/utils/status'

type Row = { id: string; token: number; name: string; status: boolean }

export const ModuleRealEstateDeveloper = ({ title }: { title: string }) => {
  const entity = 'incorporadora'

  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(25)
  const [search, setSearch] = React.useState('')

  // 👇 chave para forçar reload da lista
  const [reloadKey, setReloadKey] = React.useState(0)

  // 👇 ESTADO PARA O DIALOG
  const [open, setOpen] = React.useState(false)
  const [selectedRealEstateDeveloper, setSelectedRealEstateDeveloper] = React.useState<
    ApiRealEstateDeveloper | undefined
  >(undefined)

  const {
    rows: apiRows,
    totalCount,
    loading
  } = useRealEstateDeveloperList({
    page,
    pageSize,
    search,
    searchFields: ['name'],
    reloadKey
  })

  // mapeia para o shape da tabela
  const rows: Row[] = React.useMemo(
    () =>
      apiRows.map((r: ApiRealEstateDeveloper) => ({
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
                    setSelectedRealEstateDeveloper(rel)
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
      <PageHeader title={title} subtitle="Listagem de incorporadoras registradas" backButton />

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
              setSelectedRealEstateDeveloper(undefined)
              setOpen(true)
            }}
            male={false}
          />
        </Card.Body>
      </Card.Root>
      {/* Drawer de cliente (modo create) */}
      <RealEstateDeveloperDialogForm
        open={open}
        onOpenChange={setOpen}
        mode={selectedRealEstateDeveloper ? 'edit' : 'create'}
        initial={selectedRealEstateDeveloper}
        onSuccess={async () => {
          setReloadKey((k) => k + 1)
          setOpen(false)
        }}
      />
    </>
  )
}
