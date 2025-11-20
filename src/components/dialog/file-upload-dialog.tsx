import * as React from 'react'
import { Dialog, CloseButton, FileUpload, Icon, Box, Button } from '@chakra-ui/react'
import type { ApiCustomer } from '@/@types/api-customer'
import { BiCloudUpload } from 'react-icons/bi'
import { addFile } from '@/services/docs'
import type { ApiDocs } from '@/@types/api-docs'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Partial<ApiCustomer>
  onSuccess?: (company: ApiDocs) => void
}

export function FileUploadDialogForm({ open, onOpenChange, customer, onSuccess }: Props) {
  const [files, setFiles] = React.useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const MAX_FILES = 10

  // key para forçar o remount do FileUpload quando o dialog abre/fecha
  const [uploadKey, setUploadKey] = React.useState(0)

  React.useEffect(() => {
    // toda vez que o dialog for fechado, limpa o estado
    if (!open) {
      setFiles([])
      setUploadKey((k) => k + 1) // força recriar o FileUpload.Root
    }
  }, [open])

  const onSubmit = async () => {
    if (!customer.id) {
      console.error('customer.id não informado')
      return
    }

    if (files.length === 0) {
      console.error('Nenhum arquivo selecionado')
      return
    }

    try {
      setIsSubmitting(true)

      const res = await addFile(customer.id, files)

      if (!res || !res.success || !res.data) return

      onSuccess?.(res.data[0])

      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(details) => onOpenChange(details.open)} size="md">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Upload de documento</Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>

          <Dialog.Body>
            <FileUpload.Root key={uploadKey} maxW="xl" alignItems="stretch" maxFiles={MAX_FILES}>
              <FileUpload.HiddenInput
                multiple={true}
                onChange={(event) => {
                  const fileList = event.target.files
                  setFiles(fileList ? Array.from(fileList) : [])
                }}
              />

              <FileUpload.Dropzone>
                <Icon boxSize="8" color="fg.muted">
                  <BiCloudUpload />
                </Icon>
                <FileUpload.DropzoneContent>
                  <Box>Arraste e solte o arquivo aqui ou clique para selecionar.</Box>
                  <Box color="fg.muted">Tamanho máximo de 50MB por arquivo</Box>

                  <Box>
                    Mais {MAX_FILES - files.length} arquivo
                    {MAX_FILES - files.length !== 1 ? 's' : ''} permitidos
                  </Box>
                </FileUpload.DropzoneContent>
              </FileUpload.Dropzone>

              <FileUpload.List />
            </FileUpload.Root>
          </Dialog.Body>

          <Dialog.Footer>
            <Button onClick={onSubmit} loading={isSubmitting} disabled={files.length === 0}>
              Enviar arquivo
            </Button>
          </Dialog.Footer>

          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
