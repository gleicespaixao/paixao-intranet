import { ApiFile } from '@/@types/api-file'
import { DeleteDialog } from '@/components/dialog/controled'
import { api } from '@/lib/api'
import { deleteFile } from '@/services/file'
import { DownloadTrigger, IconButton, Menu, Portal, Stack } from '@chakra-ui/react'
import React from 'react'
import { BiDotsVerticalRounded } from 'react-icons/bi'

export const MenuFilesOptions = ({
  item,
  entity,
  setReloadKey
}: {
  item?: ApiFile
  entity: string
  setReloadKey: React.Dispatch<React.SetStateAction<number>>
}) => {
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [fileToDelete, setFileToDelete] = React.useState<ApiFile | null>(null)

  const [deleteLoading, setDeleteLoading] = React.useState(false)
  const handleConfirmDelete = async () => {
    if (!fileToDelete) return

    try {
      setDeleteLoading(true)

      const res = await deleteFile(fileToDelete.id)

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

  const dataDownload = async () => {
    const res = await api.get(`File/${item?.id}/download`, {
      responseType: 'blob'
    })
    return res.data
  }
  const mimeType = getMimeTypeFromName(`${item?.name}.${item?.format}`)

  return (
    <Stack textAlign="left">
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton aria-label="Menu" size="sm" variant="outline" disabled={item == null}>
            <BiDotsVerticalRounded />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              {/* <Menu.Item value="rename" cursor="pointer">
                Renomear
              </Menu.Item> */}
              <DownloadTrigger
                data={dataDownload}
                fileName={`${item?.name}.${item?.format}`}
                mimeType={mimeType}
                asChild
              >
                <Menu.Item value="download" cursor="pointer">
                  Baixar
                </Menu.Item>
              </DownloadTrigger>
              <Menu.Item
                cursor="pointer"
                value="delete"
                color="fg.error"
                _hover={{ bg: 'bg.error', color: 'fg.error' }}
                disabled={deleteLoading}
                onClick={() => {
                  if (item) {
                    setFileToDelete(item)
                    setDeleteOpen(true)
                  }
                }}
              >
                Excluir...
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        entity={entity}
        itemName={fileToDelete?.name}
        onConfirm={handleConfirmDelete}
      />
    </Stack>
  )
}
