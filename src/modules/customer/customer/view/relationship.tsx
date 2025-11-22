import { ApiCustomer } from '@/@types/api-customer'
import { ApiRelationship } from '@/@types/api-relationship'
import { RelationshipDialogForm } from '@/components/dialog/relationship-dialog-form'
import { ColumnDef, ListingTable } from '@/components/listing-table'
import { Tooltip } from '@/components/ui/tooltip'
import { useRelationshipList } from '@/services/relationship'
import { formatDateShort } from '@/utils/date-converter'
import { RELATIONSHIP_TYPE_MAP } from '@/utils/relationship-type'
import { Card, HStack, IconButton } from '@chakra-ui/react'
import React from 'react'
import { BiPencil } from 'react-icons/bi'

type Row = {
  id: string
  name: string
  type: string
  date: string
}

export const CustomerViewRelationship = ({ customer }: { customer: ApiCustomer }) => {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [search, setSearch] = React.useState('')

  const [reloadKey, setReloadKey] = React.useState(0)

  const {
    rows: apiRows,
    totalCount,
    loading
  } = useRelationshipList({
    page,
    pageSize,
    search,
    searchFields: ['customer.name'],
    fixedFilters: [`customer.id eq ${customer.id}`],
    reloadKey
  })

  // 👇 ESTADO PARA O DIALOG
  const [open, setOpen] = React.useState(false)
  const [selectedRelationship, setSelectedRelationship] = React.useState<ApiRelationship | undefined>(undefined)

  const rows: Row[] = React.useMemo(
    () =>
      apiRows.map((r: ApiRelationship) => {
        const customerRelationship = r.customer?.find((o) => o.id !== customer?.id)
        return {
          id: r.id,
          name: customerRelationship?.name ?? '',
          type: RELATIONSHIP_TYPE_MAP[r.type]?.label,
          date: formatDateShort(r.marriageDate)
        }
      }),
    [apiRows, customer.id]
  )

  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      { header: 'Nome', accessorKey: 'name' },
      { header: 'Tipo de relacionamento', accessorKey: 'type' },
      { header: 'Data', accessorKey: 'date' },
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
                    setSelectedRelationship(rel)
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
            includeOnClick={() => {
              setSelectedRelationship(undefined)
              setOpen(true)
            }}
          />
        </Card.Body>
      </Card.Root>
      <RelationshipDialogForm
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedRelationship(undefined)
          }
          setOpen(isOpen)
        }}
        mode={selectedRelationship ? 'edit' : 'create'}
        initial={selectedRelationship}
        customer={customer}
        onSuccess={() => {
          // atualiza em quem chamou esse componente (página)
          setReloadKey((k) => k + 1)
          // fecha o dialog (se o próprio dialog já fechar, isso é redundante mas inofensivo)
          setOpen(false)
        }}
      />
    </>
  )
}
