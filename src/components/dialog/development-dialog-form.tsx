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
import { ApiDevelopment } from '@/@types/api-development'
import { addDevelopment, deleteDevelopment, updateDevelopment } from '@/services/development'
import { DevelopmentForm, schemaDevelopment } from '@/schemas/development'
import { ControlledSelectAsync } from '../controlled-select/controlled-select-async'
import { fetchNeighborhood } from '@/services/neighborhood'
import { fetchRealEstateDeveloper } from '@/services/real-estate-developer'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  initial?: Partial<ApiDevelopment>
  onSuccess?: (typeOfProperty: ApiDevelopment) => void
}

const toDefaultValues = (rel?: Partial<ApiDevelopment>): DefaultValues<DevelopmentForm> => {
  return {
    status: rel?.status === false ? 'inactive' : 'active',
    name: rel?.name ?? '',
    neighborhood: rel?.neighborhood
      ? {
          value: rel.neighborhood.id,
          label: rel.neighborhood.name
        }
      : { value: '', label: '' },
    realEstateDeveloper:
      rel?.realEstateDeveloper && rel.realEstateDeveloper.length > 0
        ? rel.realEstateDeveloper.map((real) => ({
            value: real.id,
            label: real.name
          }))
        : []
  }
}

export function DevelopmentDialogForm({ open, onOpenChange, mode, initial, onSuccess }: Props) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset
  } = useForm<DevelopmentForm>({
    resolver: zodResolver(schemaDevelopment),
    defaultValues: toDefaultValues(initial)
  })

  // controla o dialog de delete
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deleteLoading, setDeleteLoading] = React.useState(false)

  React.useEffect(() => {
    reset(toDefaultValues(initial))
  }, [initial, reset, open])

  const onSubmit = async (payload: DevelopmentForm) => {
    let res

    if (mode === 'create') {
      res = await addDevelopment(payload)
    } else if (mode === 'edit' && initial?.id) {
      res = await updateDevelopment(initial.id, payload)
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
      const res = await deleteDevelopment(initial.id)

      if (!res.success) return

      if (onSuccess) {
        onSuccess(initial as ApiDevelopment)
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
              <Dialog.Title>{mode === 'create' ? 'Novo' : 'Editar'} projeto</Dialog.Title>
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
                  <ControlledInput
                    required
                    name="name"
                    control={control}
                    label="Nome do projeto"
                    error={errors.name?.message}
                  />
                </GridItem>

                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                  <ControlledSelectAsync
                    label="Bairro"
                    name="neighborhood"
                    control={control}
                    required
                    error={errors.neighborhood?.value?.message}
                    loadOptions={async () => {
                      const res = await fetchNeighborhood({})
                      if (res.success && res.data) {
                        return res.data.records.map((c) => ({
                          label: c.name,
                          value: c.id,
                          isDisabled: !c.status
                        }))
                      }
                      return []
                    }}
                  />
                  <ControlledSelectAsync
                    label="Incorporadora"
                    name="realEstateDeveloper"
                    control={control}
                    required
                    multiple
                    error={errors.realEstateDeveloper?.message}
                    loadOptions={async () => {
                      const res = await fetchRealEstateDeveloper({})
                      if (res.success && res.data) {
                        return res.data.records.map((c) => ({
                          label: c.name,
                          value: c.id,
                          isDisabled: !c.status
                        }))
                      }
                      return []
                    }}
                  />
                </Grid>
              </Form>
            </Dialog.Body>
            <Dialog.Footer justifyContent={mode !== 'create' ? 'space-between' : 'end'}>
              {mode !== 'create' && (
                <IconButton
                  aria-label="Excluir bairro"
                  colorPalette="red"
                  variant="subtle"
                  onClick={() => setDeleteOpen(true)}
                >
                  <BiTrashAlt />
                </IconButton>
              )}
              <Button type="submit" form="typo-of-property-form" loading={isSubmitting}>
                {mode === 'create' ? 'Salvar' : 'Atualizar'} projeto
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
          entity="projeto"
          itemName={initial?.name}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  )
}
