import * as React from 'react'
import { Dialog, Button, Grid, CloseButton, GridItem, IconButton } from '@chakra-ui/react'
import { Form } from '@/components/form'
import { DefaultValues, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlledSelect } from '../controlled-select/controlled-select'
import { DeleteDialog } from './controled'
import { BiTrashAlt } from 'react-icons/bi'
import { STATUS_OPTIONS } from '@/utils/status'
import { ControlledInput } from '../controlled-input/controlled-input'
import { ApiRealEstateDeveloper } from '@/@types/api-real-estate-developer'
import { schemaRealEstateDeveloper, RealEstateDeveloperForm } from '@/schemas/real-estate-developer'
import {
  addRealEstateDeveloper,
  deleteRealEstateDeveloper,
  updateRealEstateDeveloper
} from '@/services/real-estate-developer'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  initial?: Partial<ApiRealEstateDeveloper>
  onSuccess?: (realEstateDeveloper: ApiRealEstateDeveloper) => void
}

const toDefaultValues = (rel?: Partial<ApiRealEstateDeveloper>): DefaultValues<RealEstateDeveloperForm> => {
  return {
    status: rel?.status === false ? 'inactive' : 'active',
    name: rel?.name ?? ''
  }
}

export function RealEstateDeveloperDialogForm({ open, onOpenChange, mode, initial, onSuccess }: Props) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset
  } = useForm<RealEstateDeveloperForm>({
    resolver: zodResolver(schemaRealEstateDeveloper),
    defaultValues: toDefaultValues(initial)
  })

  // controla o dialog de delete
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deleteLoading, setDeleteLoading] = React.useState(false)

  React.useEffect(() => {
    reset(toDefaultValues(initial))
  }, [initial, reset])

  const onSubmit = async (payload: RealEstateDeveloperForm) => {
    let res

    if (mode === 'create') {
      res = await addRealEstateDeveloper(payload)
    } else if (mode === 'edit' && initial?.id) {
      res = await updateRealEstateDeveloper(initial.id, payload)
    }

    if (!res) return
    if (!res.success) return

    if (onSuccess && res.data) {
      onSuccess(res.data)
      reset()
    }

    onOpenChange(false)
  }

  const handleConfirmDelete = async () => {
    if (!initial?.id) return
    try {
      setDeleteLoading(true)
      const res = await deleteRealEstateDeveloper(initial.id)

      if (!res.success) return

      if (onSuccess) {
        onSuccess(initial as ApiRealEstateDeveloper)
      }

      // fecha ambos
      setDeleteOpen(false)
      onOpenChange(false)
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <>
      <Dialog.Root open={open} onOpenChange={(details) => onOpenChange(details.open)} size="md">
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{mode === 'create' ? 'Nova' : 'Editar'} incorporadora</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>

            <Dialog.Body>
              <Form id="typo-of-property-form" hookFormHandleSubmit={handleSubmit} onSubmit={onSubmit}>
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                  <ControlledSelect
                    name="status"
                    control={control}
                    label="Status"
                    error={errors.status?.message}
                    items={STATUS_OPTIONS}
                  />
                </Grid>
                <GridItem colSpan={{ base: 1, md: 2 }}>
                  <ControlledInput required name="name" control={control} label="Nome" error={errors.name?.message} />
                </GridItem>
              </Form>
            </Dialog.Body>
            <Dialog.Footer justifyContent={mode !== 'create' ? 'space-between' : 'end'}>
              {mode !== 'create' && (
                <IconButton
                  aria-label="Excluir incorporadora"
                  colorPalette="red"
                  variant="subtle"
                  onClick={() => setDeleteOpen(true)}
                >
                  <BiTrashAlt />
                </IconButton>
              )}
              <Button type="submit" form="typo-of-property-form" loading={isSubmitting}>
                {mode === 'create' ? 'Salvar' : 'Atualizar'} incorporadora
              </Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
      {mode !== 'create' && (
        <DeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          loading={deleteLoading}
          entity="incorporadora"
          itemName={initial?.name}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  )
}
