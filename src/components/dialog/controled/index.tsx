import * as React from 'react'
import { Dialog, Button, Stack, Text } from '@chakra-ui/react'

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: React.ReactNode
  description?: React.ReactNode
  confirmLabel?: React.ReactNode
  cancelLabel?: React.ReactNode
  onConfirm?: () => void | Promise<void>
  isDanger?: boolean
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = 'Confirmar ação',
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  isDanger,
  loading
}: ConfirmDialogProps) {
  const [submitting, setSubmitting] = React.useState(false)

  async function handleConfirm() {
    try {
      setSubmitting(true)
      await onConfirm?.()
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => {
        if (submitting) return
        onOpenChange(e.open)
      }}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>

          {description && (
            <Dialog.Body>
              <Text>{description}</Text>
            </Dialog.Body>
          )}

          <Dialog.Footer>
            <Stack direction="row" gap={2} ml="auto">
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" disabled={submitting || loading}>
                  {cancelLabel}
                </Button>
              </Dialog.ActionTrigger>
              <Button onClick={handleConfirm} loading={submitting || loading} colorPalette={isDanger ? 'red' : 'blue'}>
                {confirmLabel}
              </Button>
            </Stack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

type DeleteDialogProps = Omit<ConfirmDialogProps, 'title' | 'isDanger'> & {
  entity?: string
  itemName?: string
}

export function DeleteDialog({ entity = 'item', itemName, description, confirmLabel, ...rest }: DeleteDialogProps) {
  const title = `Excluir ${entity}`
  const body = description ?? (
    <>
      Tem certeza que deseja excluir {entity.toLowerCase()} {itemName && <b>{itemName}</b>}? Esta ação não poderá ser
      desfeita.
    </>
  )

  return (
    <Dialog.Root
      // importante: role alertdialog para padrão destrutivo, conforme docs
      role="alertdialog" // v3 Dialog vira "alert dialog" acessível com este prop
      open={rest.open}
      onOpenChange={(e) => rest.onOpenChange(e.open)}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Dialog.Body>
            <Text>{body}</Text>
          </Dialog.Body>
          <Dialog.Footer>
            <Stack direction="row" gap={2} ml="auto">
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">{rest.cancelLabel ?? 'Cancelar'}</Button>
              </Dialog.ActionTrigger>
              <Button colorPalette="red" onClick={rest.onConfirm} loading={rest.loading}>
                {confirmLabel ?? 'Excluir'}
              </Button>
            </Stack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
