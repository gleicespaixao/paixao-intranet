import * as React from 'react'
import {
  Dialog,
  CloseButton,
  FileUpload,
  Button,
  Float,
  HStack,
  VStack,
  Stack,
  Editable,
  EmptyState,
  Center
} from '@chakra-ui/react'
import type { ApiCustomer } from '@/@types/api-customer'
import {
  BiCloudUpload,
  BiImage,
  BiSolidArchive,
  BiSolidFileBlank,
  BiSolidFileDoc,
  BiSolidFilePdf,
  BiSolidFileTxt,
  BiSolidFilm,
  BiSolidMusic,
  BiX
} from 'react-icons/bi'
import { addFile } from '@/services/file'
import type { ApiFile } from '@/@types/api-file'
import { ApiDevelopment } from '@/@types/api-development'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: Partial<ApiCustomer>
  development?: Partial<ApiDevelopment>
  onSuccess?: (company: ApiFile) => void
  accept?: string
  maxFiles?: number
  maxFileSize?: number
  helperText?: string
  tag?: string
}

type UploadFile = {
  file: File
  name: string
  lastValidName: string
}

export function FileUploadDialogForm({
  open,
  onOpenChange,
  customer,
  development,
  onSuccess,
  accept = 'image/*',
  maxFiles = 1,
  maxFileSize,
  helperText,
  tag
}: Props) {
  const [files, setFiles] = React.useState<UploadFile[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

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
    const customerId = customer?.id
    const developmentId = development?.id

    if (!customerId && !developmentId) {
      console.error('É necessário informar um cliente ou um projeto (development).')
      return
    }

    if (customerId && developmentId) {
      console.error('Informe apenas cliente OU projeto, nunca ambos ao mesmo tempo.')
      return
    }

    if (files.length === 0) {
      console.error('Nenhum arquivo selecionado')
      return
    }

    try {
      setIsSubmitting(true)

      const filesToSend = files.map(({ file, name }) => {
        const safeName = name.trim() || file.name

        if (safeName === file.name) return file

        // opcional: preservar extensão original se o user remover
        const originalName = file.name
        const dotIndex = originalName.lastIndexOf('.')
        const ext = dotIndex !== -1 ? originalName.slice(dotIndex) : ''
        const hasDot = name.includes('.')
        const finalName = hasDot ? name : name + ext

        return new File([file], finalName, {
          type: file.type,
          lastModified: file.lastModified
        })
      })

      const res = await addFile(filesToSend, customerId, developmentId, tag)

      if (!res || !res.success || !res.data) return

      onSuccess?.(res.data[0])

      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getExtension = (file: File) => {
    const parts = file.name.split('.')
    if (parts.length < 2) return ''
    return parts.pop()!.toLowerCase()
  }

  const getFileKind = (file: File): FileKind => {
    const mime = file.type || ''
    const ext = getExtension(file)

    if (mime.startsWith('image/')) return 'image'
    if (mime.startsWith('audio/')) return 'audio'
    if (mime.startsWith('video/')) return 'video'

    if (ext === 'pdf') return 'pdf'
    if (['doc', 'docx', 'odt', 'rtf'].includes(ext)) return 'word'
    if (['xls', 'xlsx', 'ods', 'csv'].includes(ext)) return 'excel'
    if (['ppt', 'pptx', 'odp'].includes(ext)) return 'ppt'
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive'
    if (['txt', 'md', 'log'].includes(ext)) return 'text'

    return 'other'
  }

  type FileKind = 'image' | 'pdf' | 'word' | 'excel' | 'ppt' | 'audio' | 'video' | 'archive' | 'text' | 'other'

  const getFileIcon = (kind: FileKind) => {
    switch (kind) {
      case 'image':
        return <BiImage />
      case 'pdf':
        return <BiSolidFilePdf /> // pode trocar por outro se quiser
      case 'word':
        return <BiSolidFileTxt />
      case 'excel':
        return <BiSolidFileTxt />
      case 'ppt':
        return <BiSolidFileTxt />
      case 'audio':
        return <BiSolidMusic />
      case 'video':
        return <BiSolidFilm />
      case 'archive':
        return <BiSolidArchive />
      case 'text':
        return <BiSolidFileDoc />
      case 'other':
      default:
        return <BiSolidFileBlank />
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(details) => onOpenChange(details.open)} size="lg">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Upload de arquivos</Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>

          <Dialog.Body>
            <FileUpload.Root
              accept={accept}
              key={uploadKey}
              alignItems="stretch"
              maxFiles={maxFiles}
              maxFileSize={maxFileSize}
            >
              <FileUpload.HiddenInput
                multiple={maxFiles > 1}
                onChange={(event) => {
                  const fileList = event.target.files
                  if (!fileList) return

                  setFiles((prev) => {
                    // quantos já temos
                    const currentCount = prev.length
                    const remaining = maxFiles - currentCount

                    // se já bateu o limite, ignora novos arquivos
                    if (remaining <= 0) return prev

                    // converte FileList -> Array<File> e corta no limite restante
                    const incomingFiles = Array.from(fileList).slice(0, remaining)

                    const mapped = incomingFiles.map((file) => ({
                      file,
                      name: file.name,
                      lastValidName: file.name
                    }))

                    return [...prev, ...mapped]
                  })

                  // opcional: permite selecionar o mesmo arquivo novamente depois
                  event.target.value = ''
                }}
              />

              <FileUpload.Dropzone as={FileUpload.Trigger}>
                <FileUpload.DropzoneContent>
                  <EmptyState.Root>
                    <EmptyState.Content>
                      <EmptyState.Indicator>
                        <BiCloudUpload />
                      </EmptyState.Indicator>
                      <VStack textAlign="center">
                        <EmptyState.Title>Clique aqui para carregar seu arquivo ou arraste e solte.</EmptyState.Title>
                        {helperText && <EmptyState.Description>{helperText}</EmptyState.Description>}
                        {maxFiles && (
                          <EmptyState.Description>
                            Mais {Math.max(maxFiles - files.length, 0)} arquivo
                            {maxFiles - files.length !== 1 ? 's' : ''} permitidos
                          </EmptyState.Description>
                        )}
                      </VStack>
                    </EmptyState.Content>
                  </EmptyState.Root>

                  <Stack w="full">
                    {files.length > 0 && (
                      <VStack mb="6" gap="3" align="stretch" w="full">
                        <FileUpload.ItemGroup gap="3" onClick={(e) => e.stopPropagation()}>
                          {files.map((item, i) => (
                            <FileUpload.Item key={i} file={item.file} w="full" textAlign="left">
                              <HStack gap="3" p="3" borderWidth="1px" borderRadius="md" w="full">
                                <FileUpload.ItemPreview>
                                  {(() => {
                                    const kind = getFileKind(item.file)

                                    if (kind === 'image') {
                                      // imagens usam o preview nativo
                                      return <FileUpload.ItemPreviewImage boxSize="16" borderRadius="md" />
                                    }

                                    // outros tipos usam ícone
                                    return (
                                      <Center boxSize="16" borderRadius="md" borderWidth="1px">
                                        {getFileIcon(kind)}
                                      </Center>
                                    )
                                  })()}
                                </FileUpload.ItemPreview>

                                <FileUpload.ItemContent flex="1">
                                  <FileUploadEditable
                                    value={item.name}
                                    onValueChange={({ value }) => {
                                      setFiles((prev) =>
                                        prev.map((f, idx) =>
                                          idx === i
                                            ? {
                                                ...f,
                                                name: value,
                                                // só atualiza lastValidName quando não está vazio
                                                lastValidName: value.trim() ? value : f.lastValidName
                                              }
                                            : f
                                        )
                                      )
                                    }}
                                    onValueCommit={({ value }) => {
                                      // se o usuário "deixar vazio" ao sair/confirmar, volta pro último nome
                                      if (!value.trim()) {
                                        setFiles((prev) =>
                                          prev.map((f, idx) =>
                                            idx === i
                                              ? {
                                                  ...f,
                                                  name: f.lastValidName
                                                }
                                              : f
                                          )
                                        )
                                      }
                                    }}
                                  />

                                  <FileUpload.ItemSizeText fontSize="xs" color="gray.500" />
                                </FileUpload.ItemContent>

                                <Float placement="top-end">
                                  <FileUpload.ItemDeleteTrigger
                                    onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                                  >
                                    <BiX />
                                  </FileUpload.ItemDeleteTrigger>
                                </Float>
                              </HStack>
                            </FileUpload.Item>
                          ))}
                        </FileUpload.ItemGroup>
                      </VStack>
                    )}
                  </Stack>
                </FileUpload.DropzoneContent>
              </FileUpload.Dropzone>
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

type FileUploadEditableProps = React.ComponentProps<typeof Editable.Root> & {
  children?: React.ReactNode
}

const FileUploadEditable = (props: FileUploadEditableProps) => {
  const { ...rootProps } = props

  return (
    <Editable.Root fontSize="xs" w="full" minW={0} activationMode="dblclick" submitMode="both" {...rootProps}>
      <Editable.Preview
        lineHeight="shorter"
        w="full"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        display="block"
      />
      <Editable.Input
        onKeyDown={(event) => {
          // vamos tratar o espaço aqui (ver próxima seção)
          if (event.key === ' ' || event.key === 'Spacebar') {
            event.preventDefault()
            event.stopPropagation()

            const current = (rootProps.value as string) ?? ''
            const next = `${current} `

            // dispara manualmente o onValueChange pro pai
            rootProps.onValueChange?.({ value: next })
          }
        }}
      />
    </Editable.Root>
  )
}
