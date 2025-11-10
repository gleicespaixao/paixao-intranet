import { ApiCustomer } from '@/@types/api-customer'
import { ApiCompany } from '@/@types/api-company'
import { ColumnDef, ListingTable } from '@/components/listing-table'
import { useCompanyList } from '@/services/company'
import { Card } from '@chakra-ui/react'
import React from 'react'
import { formatPhoneNumber } from '@/utils/format-phone-number'
import { formatCNPJ } from '@/utils/format-doc'

type Row = {
  id: string
  name: string
  phone: string
  cnpj: string
}

export const CustomerViewCompany = ({ customer }: { customer: ApiCustomer }) => {
  // paginação controlada
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  // busca
  const [search, setSearch] = React.useState('')

  const {
    rows: apiRows,
    totalCount,
    loading
  } = useCompanyList({
    page,
    pageSize,
    search,
    searchFields: ['customer.name'],
    fixedFilters: [`customer.id eq ${customer.id}`]
  })

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
      { header: 'CNPJ', accessorKey: 'cnpj' }
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
        />
      </Card.Body>
    </Card.Root>
  )
}
