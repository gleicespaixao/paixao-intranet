import { ApiCustomer } from '@/@types/api-customer'
import { ApiPurchaseHistory } from '@/@types/api-purchase-history'
import { PurchaseHistoryDrawerForm } from '@/components/drawer/purchase-history-drawer-form'
import { ColumnDef, ListingTable } from '@/components/listing-table'
import { Tooltip } from '@/components/ui/tooltip'
import { getCustomerById } from '@/services/customer'
import { usePurchaseHistoryList } from '@/services/purchase-history'
import { Card, FormatNumber, HStack, IconButton, LocaleProvider } from '@chakra-ui/react'
import React from 'react'
import { BiPencil } from 'react-icons/bi'

type Row = {
  id: string
  development: string
  unit: string
  floorPlan: string
  amount: number
  percentage: number | null
}

export const CustomerViewPurchaseHistory = ({
  customer,
  onCustomerChange
}: {
  customer: ApiCustomer
  onCustomerChange?: (customer: ApiCustomer) => void
}) => {
  // paginação controlada
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(25)
  const [search, setSearch] = React.useState('')

  // 👇 chave para forçar reload da lista
  const [reloadKey, setReloadKey] = React.useState(0)

  const {
    rows: apiRows,
    totalCount,
    loading
  } = usePurchaseHistoryList({
    page,
    pageSize,
    search,
    searchFields: ['development.name', 'unit', 'floorPlan', 'amount'],
    fixedFilters: [`ownerCustomer.id eq ${customer.id}`],
    reloadKey
  })

  // 👇 ESTADO PARA O DIALOG
  const [open, setOpen] = React.useState(false)
  const [selectedPurchaseHistory, setSelectedPurchaseHistory] = React.useState<ApiPurchaseHistory | undefined>(
    undefined
  )

  const rows: Row[] = React.useMemo(
    () =>
      apiRows.map((r: ApiPurchaseHistory) => {
        const share = r.ownerCustomer?.find((o) => o.id === customer?.id)
        return {
          id: r.id,
          development: r.development.name ?? '',
          unit: r.unit ?? '',
          floorPlan: r.floorPlan ?? '',
          amount: r.amount,
          percentage: share?.percentage ?? null
        }
      }),
    [apiRows, customer.id]
  )

  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      { header: 'Projeto', accessorKey: 'development' },
      { header: 'Unidade', accessorKey: 'unit' },
      {
        header: 'Planta',
        accessorKey: 'floorPlan',
        cell: (r) => (!r.floorPlan ? '0m²' : `${r.floorPlan}m²`)
      },
      {
        header: 'Porcentagem',
        accessorKey: 'percentage',
        cell: (r) =>
          r.percentage == null ? (
            '—'
          ) : (
            <LocaleProvider locale="pt-BR">
              <FormatNumber value={r.percentage / 100} style="percent" maximumFractionDigits={2} />
            </LocaleProvider>
          )
      },
      {
        header: 'Valor de compra',
        cell: (r) => (
          <LocaleProvider locale="pt-BR">
            <FormatNumber value={r.amount} style="currency" currency="BRL" />
          </LocaleProvider>
        )
      },
      {
        id: 'actions',
        header: '',
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
                    setSelectedPurchaseHistory(rel)
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

  React.useEffect(() => {
    setPage(1)
  }, [search])

  return (
    <>
      <Card.Root>
        <Card.Body p={0}>
          <ListingTable
            simple={true}
            entity="histórico de compras"
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
              setSelectedPurchaseHistory(undefined)
              setOpen(true)
            }}
          />
        </Card.Body>
      </Card.Root>
      <PurchaseHistoryDrawerForm
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedPurchaseHistory(undefined)
          }
          setOpen(isOpen)
        }}
        mode={selectedPurchaseHistory ? 'edit' : 'create'}
        initial={selectedPurchaseHistory}
        customer={customer}
        onSuccess={async () => {
          setReloadKey((k) => k + 1)
          setOpen(false)
          // 👇 avisa o pai com o cliente atualizado (ticket médio / última compra)
          if (onCustomerChange) {
            const res = await getCustomerById(customer.id)
            if (res.success && res.data) {
              onCustomerChange(res.data)
            }
          }
        }}
      />
    </>
  )
}
