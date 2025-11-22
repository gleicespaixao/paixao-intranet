'use client'

import * as React from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, HStack, IconButton } from '@chakra-ui/react'
import { ColumnDef, ListingTable } from '@/components/listing-table'
import { Tooltip } from '@/components/ui/tooltip'
import { BiPencil } from 'react-icons/bi'
import type { ApiCompany } from '@/@types/api-company'
import { useCompanyList } from '@/services/company'
import { CompanyDrawerForm } from '@/components/drawer/company-drawer-form'
import { formatPhoneForList } from '@/utils/phone-ddi-config'

type Row = { id: string; name: string; phone: string; email: string }

export const ModuleCompany = ({ title }: { title: string }) => {
  const entity = 'empresa'

  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(25)
  const [search, setSearch] = React.useState('')

  // 👇 chave para forçar reload da lista
  const [reloadKey, setReloadKey] = React.useState(0)

  // 👇 controle do drawer
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [selectedCompany, setSelectedCompany] = React.useState<ApiCompany | undefined>(undefined)

  const {
    rows: apiRows,
    totalCount,
    loading
  } = useCompanyList({
    page,
    pageSize,
    search,
    searchFields: ['name', 'email', 'phone'],
    reloadKey
  })

  // mapeia para o shape da tabela (deixa o estado fora; só deriva)
  const rows: Row[] = React.useMemo(
    () =>
      apiRows.map((r: ApiCompany) => ({
        id: r.id,
        name: r.name ?? '',
        phone: r.phone ?? '',
        email: r.email ?? ''
      })),
    [apiRows]
  )

  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      { header: 'Nome', accessorKey: 'name' },
      { header: 'Telefone', accessorKey: 'phone', cell: (r) => formatPhoneForList(String(r.phone ?? ''), true) },
      { header: 'E-mail', accessorKey: 'email' },
      {
        id: 'actions',
        header: 'Ações',
        align: 'right',
        cell: () => (
          <HStack gap={2} justify="flex-end">
            <Tooltip content="Visualizar" openDelay={300}>
              <IconButton
                aria-label="Visualizar"
                size="sm"
                variant="subtle"
                onClick={() => {
                  const rel = apiRows.find((r) => r.id === r.id)

                  if (rel) {
                    setSelectedCompany(rel)
                    setDrawerOpen(true)
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
      <PageHeader title={title} subtitle="Listagem de empresas registrados" backButton />

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
              setDrawerOpen(true)
            }}
            male={false}
          />
        </Card.Body>
      </Card.Root>
      {/* Drawer de empresa (modo create) */}
      <CompanyDrawerForm
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={selectedCompany ? 'edit' : 'create'}
        initial={selectedCompany}
        onSuccess={() => {
          // 👉 depois de salvar, recarrega a lista
          setReloadKey((k) => k + 1)
        }}
      />
    </>
  )
}
