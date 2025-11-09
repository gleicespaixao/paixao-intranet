import { ApiCustomer } from '@/@types/api-customer'
import { ApiPurchaseHistory } from '@/@types/api-purchase-history'
import { ColumnDef, ListingTable } from '@/components/listing-table'
import { usePurchaseHistoryList } from '@/services/purchase-history'
import { Card, FormatNumber, LocaleProvider } from '@chakra-ui/react'
import React from 'react'

type Row = {
  id: string
  development: string
  unit: string
  floorPlan: string
  amount: number
  percentage: number | null
}

export const CustomerViewPurchaseHistory = ({ customer }: { customer?: ApiCustomer; loading: boolean }) => {
  // paginação controlada
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  // busca
  const [search, setSearch] = React.useState('')

  const {
    rows: apiRows,
    totalCount,
    loading
  } = usePurchaseHistoryList({
    page,
    pageSize,
    search,
    searchFields: ['development.name', 'unit', 'floorPlan', 'amount'],
    fixedFilters: customer?.id ? [`ownerCustomer.id eq ${customer.id}`] : []
  })

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
    [apiRows, customer?.id]
  )

  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      { header: 'Projeto', accessorKey: 'development' },
      { header: 'Unidade', accessorKey: 'unit' },
      { header: 'Planta', accessorKey: 'floorPlan' },
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
        header: 'Valor',
        cell: (r) => (
          <LocaleProvider locale="pt-BR">
            <FormatNumber value={r.amount} style="currency" currency="BRL" />
          </LocaleProvider>
        )
      }
    ],
    []
  )

  React.useEffect(() => {
    setPage(1)
  }, [search])

  return (
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
          // includeHref="sd"
        />
      </Card.Body>
    </Card.Root>
  )
}
