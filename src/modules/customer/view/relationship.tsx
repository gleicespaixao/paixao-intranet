import { ApiCustomer } from '@/@types/api-customer'
import { ApiRelationship } from '@/@types/api-relationship'
import { ColumnDef, ListingTable } from '@/components/listing-table'
import { useRelationshipList } from '@/services/relationship'
import { formatDateShort } from '@/utils/date-converter'
import { translateRelationshipType } from '@/utils/relationship-type'
import { Card } from '@chakra-ui/react'
import React from 'react'

type Row = {
  id: string
  name: string
  type: string
  date: string
}

export const CustomerViewRelationship = ({ customer }: { customer: ApiCustomer }) => {
  // paginação controlada
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  // busca
  const [search, setSearch] = React.useState('')

  const {
    rows: apiRows,
    totalCount,
    loading
  } = useRelationshipList({
    page,
    pageSize,
    search,
    searchFields: ['customer.name'],
    fixedFilters: [`customer.id eq ${customer.id}`]
  })

  const rows: Row[] = React.useMemo(
    () =>
      apiRows.map((r: ApiRelationship) => {
        const customerRelationship = r.customer?.find((o) => o.id !== customer?.id)
        return {
          id: r.id,
          name: customerRelationship?.name ?? '',
          type: translateRelationshipType(r.type),
          date: formatDateShort(r.marriageDate)
        }
      }),
    [apiRows, customer.id]
  )

  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      { header: 'Nome', accessorKey: 'name' },
      { header: 'Tipo de relacionamento', accessorKey: 'type' },
      { header: 'Data', accessorKey: 'date' }
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
          entity="relacionamentos"
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
        />
      </Card.Body>
    </Card.Root>
  )
}
