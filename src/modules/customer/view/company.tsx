import { ApiCustomer } from '@/@types/api-customer'
import { ApiCompany } from '@/@types/api-company'
import { ColumnDef, ListingTable } from '@/components/listing-table'
import { removeCustumerCompany, useCompanyList } from '@/services/company'
import { Card, HStack, IconButton } from '@chakra-ui/react'
import React from 'react'
import { formatPhoneNumber } from '@/utils/format-phone-number'
import { formatCNPJ } from '@/utils/format-doc'
import { CompanyDialogForm } from '@/components/dialog/company-dialog-form'
import { BiTrashAlt } from 'react-icons/bi'
import { Tooltip } from '@/components/ui/tooltip'
import { DeleteDialog } from '@/components/dialog/controled'

type Row = {
  id: string
  name: string
  phone: string
  cnpj: string
}

export const CustomerViewCompany = ({ customer }: { customer: ApiCustomer }) => {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [search, setSearch] = React.useState('')

  const [reloadKey, setReloadKey] = React.useState(0)

  const {
    rows: apiRows,
    totalCount,
    loading
  } = useCompanyList({
    page,
    pageSize,
    search,
    searchFields: ['customer.name'],
    fixedFilters: [`customer.id eq ${customer.id}`],
    reloadKey
  })

  // dialog de criar/editar empresa
  const [open, setOpen] = React.useState(false)
  const [selectedCompany, setSelectedCompany] = React.useState<ApiCompany | undefined>(undefined)

  // dialog de delete
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deleteLoading, setDeleteLoading] = React.useState(false)
  const [companyToDelete, setCompanyToDelete] = React.useState<ApiCompany | null>(null)

  const rows: Row[] = React.useMemo(
    () =>
      apiRows.map((r: ApiCompany) => {
        return {
          id: r.id,
          name: r?.name ?? '',
          phone: formatPhoneNumber(r?.phone) ?? '',
          cnpj: formatCNPJ(r?.cnpj) ?? ''
        }
      }),
    [apiRows]
  )

  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      { header: 'Nome', accessorKey: 'name' },
      { header: 'Telefone', accessorKey: 'phone' },
      { header: 'CNPJ', accessorKey: 'cnpj' },
      {
        id: 'actions',
        header: '',
        align: 'right',
        cell: (row) => (
          <HStack gap={2} justify="flex-end">
            <Tooltip content="Excluir" openDelay={300}>
              <IconButton
                aria-label="Excluir"
                size="sm"
                variant="subtle"
                colorPalette="red"
                loading={deleteLoading}
                onClick={() => {
                  // encontra a empresa correspondente à linha
                  const company = apiRows.find((r) => r.id === row.id)

                  if (company) {
                    setCompanyToDelete(company)
                    setDeleteOpen(true) // 👉 abre o dialog de confirmação
                  }
                }}
              >
                <BiTrashAlt />
              </IconButton>
            </Tooltip>
          </HStack>
        )
      }
    ],
    [apiRows, deleteLoading]
  )

  React.useEffect(() => {
    setPage(1)
  }, [search])

  const handleConfirmDelete = async () => {
    if (!companyToDelete) return

    try {
      setDeleteLoading(true)

      const res = await removeCustumerCompany(companyToDelete.id, customer.id!)

      if (!res.success) return

      // recarrega a listagem
      setReloadKey((k) => k + 1)

      // fecha o dialog e limpa o selecionado
      setDeleteOpen(false)
      setCompanyToDelete(null)
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <>
      <Card.Root>
        <Card.Body p={0}>
          <ListingTable
            simple={true}
            entity="empresas"
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
              setSelectedCompany(undefined)
              setOpen(true)
            }}
          />
        </Card.Body>
      </Card.Root>

      <CompanyDialogForm
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedCompany(undefined)
          }
          setOpen(isOpen)
        }}
        initial={selectedCompany}
        customer={customer}
        onSuccess={() => {
          setReloadKey((k) => k + 1)
          setOpen(false)
        }}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        loading={deleteLoading}
        entity="vínculo com a empresa"
        itemName={companyToDelete?.name}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
