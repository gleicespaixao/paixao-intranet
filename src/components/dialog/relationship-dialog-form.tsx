import * as React from 'react'
import { Dialog, Button, Grid, CloseButton, HStack, GridItem, IconButton } from '@chakra-ui/react'
import { Form } from '@/components/form'
import { DefaultValues, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ApiCustomer } from '@/@types/api-customer'
import { ControlledInputDate } from '../controlled-input/date'
import { ControlledSelect } from '../controlled-select/controlled-select'
import { ControlledSelectAsync } from '../controlled-select/controlled-select-async'
import { fetchCustomers } from '@/services/customer'
import { ApiRelationship } from '@/@types/api-relationship'
import { RelationshipForm, schemaRelationship } from '@/schemas/relationship'
import { addRelationship, deleteRelationship, updateRelationship } from '@/services/relationship'
import { formatPhoneNumber } from '@/utils/format-phone-number'
import { RELATIONSHIP_TYPE_OPTIONS } from '@/utils/relationship-type'
import { DeleteDialog } from './controled'
import { BiPlus, BiTrashAlt } from 'react-icons/bi'
import { Tooltip } from '../ui/tooltip'
import { CustomerDrawerForm } from '../drawer/customer-drawer-form'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  initial?: Partial<ApiRelationship>
  customer: Partial<ApiCustomer>
  onSuccess?: (relationship: ApiRelationship) => void
}

const toDefaultValues = (
  customer: Partial<ApiCustomer>,
  rel?: Partial<ApiRelationship>
): DefaultValues<RelationshipForm> => {
  const linkedCustomer = rel?.customer?.find((c) => (customer ? c.id !== customer.id : true)) ?? rel?.customer?.[0]

  return {
    customer: linkedCustomer
      ? {
          value: linkedCustomer.id,
          label: linkedCustomer.name
        }
      : undefined,
    type: rel?.type ?? 'spouse',
    marriageDate:
      rel?.marriageDate && rel.marriageDate !== '0001-01-01' ? new Date(rel.marriageDate + 'T12:00:00') : null
  }
}

export function RelationshipDialogForm({ open, onOpenChange, mode, initial, customer, onSuccess }: Props) {
  const defaultValues = React.useMemo(() => toDefaultValues(customer, initial), [customer, initial])

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset
  } = useForm<RelationshipForm>({
    resolver: zodResolver(schemaRelationship),
    defaultValues
  })

  // controla o dialog de delete
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deleteLoading, setDeleteLoading] = React.useState(false)

  const [customerOpen, setCustomerOpen] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      reset(defaultValues)
    }
  }, [defaultValues, reset, open])

  const onSubmit = async (payload: RelationshipForm) => {
    let res

    if (mode === 'create') {
      res = await addRelationship(payload, customer?.id)
    } else if (mode === 'edit' && initial?.id) {
      res = await updateRelationship(initial.id, payload, customer?.id)
    }

    if (!res) return
    if (!res.success) return

    if (onSuccess && res.data) {
      onSuccess(res.data)
      reset()
    }

    onOpenChange(false)
  }

  const relationshipType = useWatch({
    control,
    name: 'type'
  }) as string | undefined

  // nome do cliente vinculado pra mostrar no dialog de delete (opcional)
  const linkedCustomerName = React.useMemo(() => {
    const linked = initial?.customer?.find((c) => (customer ? c.id !== customer.id : true)) ?? initial?.customer?.[0]
    return linked?.name ?? ''
  }, [initial, customer])

  const handleConfirmDelete = async () => {
    if (!initial?.id) return
    try {
      setDeleteLoading(true)
      const res = await deleteRelationship(initial.id)

      if (!res.success) return

      if (onSuccess) {
        onSuccess(initial as ApiRelationship)
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
              <Dialog.Title>{mode === 'create' ? 'Novo' : 'Editar'} relacionamento</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>

            <Dialog.Body>
              <Form id="relationship-form" hookFormHandleSubmit={handleSubmit} onSubmit={onSubmit}>
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                  <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                    <ControlledSelectAsync
                      label="Cliente"
                      name="customer"
                      control={control}
                      isFilter
                      required
                      error={errors.customer?.message}
                      placeholder="Selecione um cliente"
                      loadOptions={async (_inputValue?: string, searchTxt?: string) => {
                        const term = (searchTxt ?? '').trim()

                        const res = await fetchCustomers({
                          search: term || undefined,
                          searchFields: ['name', 'email', 'phone'],
                          page: 1,
                          pageSize: 20,
                          fixedFilters: [`id ne ${customer?.id}`]
                        })

                        if (res.success && res.data) {
                          return res.data.records.map((c) => ({
                            label: `${c.name} - ${c.email ?? formatPhoneNumber(c.phone)}`,
                            value: c.id
                          }))
                        }

                        return []
                      }}
                    />
                    {mode === 'create' && (
                      <Tooltip content="Novo cliente" openDelay={300}>
                        <IconButton
                          mt={6}
                          aria-label="Novo cliente"
                          variant="subtle"
                          onClick={() => setCustomerOpen(true)}
                        >
                          <BiPlus />
                        </IconButton>
                      </Tooltip>
                    )}
                  </GridItem>

                  <ControlledSelect
                    label="Tipo"
                    name="type"
                    control={control}
                    error={errors.type?.message}
                    items={RELATIONSHIP_TYPE_OPTIONS}
                  />

                  {relationshipType === 'spouse' && (
                    <ControlledInputDate
                      required
                      name="marriageDate"
                      control={control}
                      label="Data do casamento"
                      error={errors.marriageDate?.message}
                      disablePortal
                    />
                  )}
                </Grid>
              </Form>
            </Dialog.Body>
            <Dialog.Footer justifyContent={mode !== 'create' ? 'space-between' : 'end'}>
              {mode !== 'create' && (
                <IconButton
                  aria-label="Excluir relacionamento"
                  colorPalette="red"
                  variant="subtle"
                  onClick={() => setDeleteOpen(true)}
                >
                  <BiTrashAlt />
                </IconButton>
              )}
              <Button type="submit" form="relationship-form" loading={isSubmitting}>
                {mode === 'create' ? 'Salvar' : 'Atualizar'} relacionamento
              </Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
      {mode !== 'create' ? (
        <DeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          loading={deleteLoading}
          entity="relacionamento"
          itemName={linkedCustomerName}
          onConfirm={handleConfirmDelete}
        />
      ) : (
        <CustomerDrawerForm
          open={customerOpen}
          onOpenChange={setCustomerOpen}
          mode="create"
          initial={undefined}
          // onSuccess={() => {
          //   // 👉 depois de salvar, recarrega a lista
          //   setReloadKey((k) => k + 1)
          // }}
        />
      )}
    </>
  )
}
