import { ApiCustomer } from '@/@types/api-customer'
import { ApiDocs } from '@/@types/api-docs'
import { DeleteDialog } from '@/components/dialog/controled'
import { FileUploadDialogForm } from '@/components/dialog/file-upload-dialog'
import { ColumnDef, ListingTable } from '@/components/listing-table'
import { Tooltip } from '@/components/ui/tooltip'
import { api } from '@/lib/api'
import { deleteFile, useDocsList } from '@/services/docs'
import { Card, DownloadTrigger, FormatByte, HStack, IconButton } from '@chakra-ui/react'
import React from 'react'
import { BiCloudDownload, BiTrashAlt } from 'react-icons/bi'

type Row = {
  id: string
  name: string
  type: string
  size: number
}

export const CustomerViewDocs = ({ customer }: { customer: ApiCustomer }) => {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [search, setSearch] = React.useState('')

  const [reloadKey, setReloadKey] = React.useState(0)

  const {
    rows: apiRows,
    totalCount,
    loading
  } = useDocsList({
    userId: customer.id,
    page,
    pageSize,
    search,
    searchFields: ['name'],
    reloadKey
  })

  // 👇 ESTADO PARA O DIALOG
  const [open, setOpen] = React.useState(false)

  // dialog de delete
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deleteLoading, setDeleteLoading] = React.useState(false)
  const [fileToDelete, setFileToDelete] = React.useState<ApiDocs | null>(null)

  const getMimeTypeFromName = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase()

    switch (ext) {
      case 'pdf':
        return 'application/pdf'
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'
      case 'png':
        return 'image/png'
      case 'gif':
        return 'image/gif'
      case 'gpx':
        return 'application/gpx+xml'
      case 'txt':
        return 'text/plain'
      default:
        return 'application/octet-stream'
    }
  }

  const rows: Row[] = React.useMemo(
    () =>
      apiRows.map((r: ApiDocs) => {
        return {
          id: r.id,
          name: r?.name,
          type: r?.type,
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
      { header: 'Tipo', accessorKey: 'type' },
      {
        id: 'actions',
        header: '',
        align: 'right',
        cell: (row) => {
          const dataDownload = async () => {
            const res = await api.get(`Tools/file/${row.id}/download`, {
              responseType: 'blob'
            })
            return res.data
          }
          const mimeType = getMimeTypeFromName(`${row.name}.${row.type}`)
          console.log('`${row.name}.${row.extension}`', `${row.type}`)
          return (
            <HStack gap={2} justify="flex-end">
              <Tooltip content="Download" openDelay={300}>
                <DownloadTrigger data={dataDownload} fileName={`${row.name}.${row.type}`} mimeType={mimeType} asChild>
                  <IconButton aria-label="Download" size="sm" variant="subtle">
                    <BiCloudDownload />
                  </IconButton>
                </DownloadTrigger>
              </Tooltip>
              <Tooltip content="Excluir" openDelay={300}>
                <IconButton
                  aria-label="Excluir"
                  size="sm"
                  variant="subtle"
                  colorPalette="red"
                  loading={deleteLoading}
                  onClick={() => {
                    const rel = apiRows.find((r) => r.id === row.id)

                    if (rel) {
                      setFileToDelete(rel)
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
      }
    ],
    [apiRows, deleteLoading]
  )

  React.useEffect(() => {
    setPage(1)
  }, [search])

  const handleConfirmDelete = async () => {
    if (!fileToDelete) return

    try {
      setDeleteLoading(true)

      const res = await deleteFile(customer.id!, fileToDelete.id)

      if (!res.success) return

      // recarrega a listagem
      setReloadKey((k) => k + 1)

      // fecha o dialog e limpa o selecionado
      setDeleteOpen(false)
      setFileToDelete(null)
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
            entity="documentos"
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
          />
        </Card.Body>
      </Card.Root>
      <FileUploadDialogForm
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
        }}
        customer={customer}
        onSuccess={async () => {
          setReloadKey((k) => k + 1)
          setOpen(false)
        }}
      />
      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        loading={deleteLoading}
        entity="documento"
        itemName={fileToDelete?.name}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
