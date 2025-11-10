import React from 'react'
import { IconButton } from '@chakra-ui/react'
import { BiTrash } from 'react-icons/bi'
import { DeleteDialog } from '.'

type ControlledDeleteButtonProps<T> = {
  data: T
  entity?: string
  itemName?: string
  onDelete: (data: T) => Promise<unknown> | unknown
  onSuccess?: (data: T) => void
  onError?: (error: unknown, data: T) => void
  renderTrigger?: (open: () => void, loading: boolean) => React.ReactNode
  /** URL para redirecionar após sucesso */
  redirectTo?: string
  /** Função de navegação (React Router: useNavigate, Next: router.push, etc.) */
  navigate?: (to: string) => void
}

export function ControlledDeleteButton<T>({
  data,
  entity = 'registro',
  itemName,
  onDelete,
  onSuccess,
  onError,
  renderTrigger,
  redirectTo,
  navigate
}: ControlledDeleteButtonProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await onDelete(data)
      onSuccess?.(data)

      // redireciona se solicitado
      if (redirectTo) {
        if (navigate) navigate(redirectTo)
        else if (typeof window !== 'undefined') window.location.assign(redirectTo)
      }

      setOpen(false)
    } catch (err) {
      onError?.(err, data)
    } finally {
      setLoading(false)
    }
  }

  const defaultTrigger = (
    <IconButton aria-label="Excluir" colorPalette="red" variant="ghost" onClick={() => setOpen(true)}>
      <BiTrash />
    </IconButton>
  )

  return (
    <>
      {renderTrigger ? renderTrigger(() => setOpen(true), loading) : defaultTrigger}

      <DeleteDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleDelete}
        loading={loading}
        entity={entity}
        itemName={itemName}
      />
    </>
  )
}
