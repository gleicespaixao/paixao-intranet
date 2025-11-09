import { ApiCustomer } from '@/@types/api-customer'
import { ApiPurchaseHistory } from '@/@types/api-purchase-history'
import { ColumnDef, ListingTable } from '@/components/listing-table'
import { usePurchaseHistoryList } from '@/services/purchase-history'
import { Card, FormatNumber, LocaleProvider } from '@chakra-ui/react'
import React from 'react'

type Row = { id: string; development: string; unit: string; floorPlan: string; amount: number }

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
    fixedFilters: [`ownerCustomer.id eq ${customer?.id}`]
  })

  // mapeia para o shape da tabela (deixa o estado fora; só deriva)
  const rows: Row[] = React.useMemo(
    () =>
      apiRows.map((r: ApiPurchaseHistory) => ({
        id: r.id,
        development: r.development.name ?? '',
        unit: r.unit ?? '',
        floorPlan: r.floorPlan ?? '',
        amount: r.amount
      })),
    [apiRows]
  )

  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      { header: 'Projeto', accessorKey: 'development' },
      { header: 'Unidade', accessorKey: 'unit' },
      { header: 'Planta', accessorKey: 'floorPlan' },
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

  // resetar para página 1 quando o termo de busca mudar
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
