import { ApiDevelopment } from '@/@types/api-development'
import { ApiFile } from '@/@types/api-file'
import { FileUploadDialogForm } from '@/components/dialog/file-upload-dialog'
import { ColumnDef, ListingTable } from '@/components/listing-table'
import { useFilesList } from '@/services/file'
import { Card, FormatByte, HStack } from '@chakra-ui/react'
import React from 'react'
import { MenuFilesOptions } from '../../../../components/menu-files-options'

type Row = {
  id: string
  name: string
  format: string
  size: number
}

export const DevelopmentViewFloorPlan = ({
  development,
  disabled
}: {
  development?: Partial<ApiDevelopment>
  disabled: boolean
}) => {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [search, setSearch] = React.useState('')

  const [reloadKey, setReloadKey] = React.useState(0)

  const {
    rows: apiRows,
    totalCount,
    loading
  } = useFilesList({
    page,
    pageSize,
    search,
    searchFields: ['name'],
    reloadKey,
    fixedFilters: [`development.id eq ${development?.id ?? 0}`, 'tag eq floor-plant']
  })

  // 👇 ESTADO PARA O DIALOG
  const [open, setOpen] = React.useState(false)

  const rows: Row[] = React.useMemo(
    () =>
      apiRows.map((r: ApiFile) => {
        return {
          id: r.id,
          name: r?.name,
          format: r?.format,
          size: r?.size ?? 0
        }
      }),
    [apiRows]
  )

  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      { header: 'Nome', accessorKey: 'name' },
      {
        id: 'size',
        header: 'Tamanho',
        cell: (row) => {
          return <FormatByte value={row.size} />
        }
      },
      { header: 'Formato', accessorKey: 'format' },
      {
        id: 'actions',
        header: '',
        align: 'right',
        cell: (row) => {
          const rel = apiRows.find((r) => r.id === row.id)
          return (
            <HStack gap={2} justify="flex-end">
              <MenuFilesOptions item={rel} entity="planta baixa" setReloadKey={setReloadKey} />
            </HStack>
          )
        }
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
            entity="plantas baixas"
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
              setOpen(true)
            }}
            disabled={disabled}
          />
        </Card.Body>
      </Card.Root>
      <FileUploadDialogForm
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
        }}
        development={development}
        onSuccess={async () => {
          setReloadKey((k) => k + 1)
          setOpen(false)
        }}
        maxFiles={10}
        maxFileSize={1}
        helperText="Formatos suportados: SVG, JPG, PNG (1MB cada)"
        tag="floor-plant"
      />
    </>
  )
}
