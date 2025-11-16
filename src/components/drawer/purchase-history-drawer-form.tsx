import * as React from 'react'
import {
  Drawer,
  Tabs,
  Button,
  Stack,
  Grid,
  CloseButton,
  HStack,
  GridItem,
  Separator,
  Text,
  IconButton,
  Alert
} from '@chakra-ui/react'
import { Form } from '@/components/form'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlledInput } from '../controlled-input/controlled-input'
import { ControlledSelectAsync } from '../controlled-select/controlled-select-async'
import { fetchDevelopment } from '@/services/development'
import { PurchaseHistoryForm, schemaPurchaseHistory } from '@/schemas/purchase-history'
import { ApiPurchaseHistory } from '@/@types/api-purchase-history'
import { addPurchaseHistory, deletePurchaseHistory, updatePurchaseHistory } from '@/services/purchase-history'
import { ControlledCurrencyInput } from '../controlled-input/controlled-currency-input'
import { fetchCustomers } from '@/services/customer'
import { ControlledInputNumber } from '../controlled-input/controlled-input-number'
import { BiTrashAlt } from 'react-icons/bi'
import { ApiCustomer } from '@/@types/api-customer'
import { formatBrCurrencyFromNumber } from '@/hooks/use-currency-brl.ts'
import { DeleteDialog } from '../dialog/controled'
import { formatPhoneForList } from '@/utils/phone-ddi-config'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  customer: Partial<ApiCustomer>
  initial?: Partial<ApiPurchaseHistory>
  onSuccess?: (company: ApiPurchaseHistory) => void
}

const toDefaultValues = (customer: Partial<ApiCustomer>, c?: Partial<ApiPurchaseHistory>): PurchaseHistoryForm => ({
  development: c?.development
    ? {
        value: c?.development.id,
        label: c?.development.name
      }
    : { value: '', label: '' },
  unit: c?.unit ?? '',
  floorPlan: c?.floorPlan ?? '',
  amount: formatBrCurrencyFromNumber(c?.amount ?? null),
  ownerCustomer:
    c?.ownerCustomer && c.ownerCustomer.length > 0
      ? c.ownerCustomer.map((customer) => ({
          customer: {
            value: customer.id,
            label: customer.name
          },
          percentage: customer.percentage / 100
        }))
      : [
          {
            customer: { value: customer.id ?? '', label: customer.name ?? '' },
            percentage: 1
          }
        ]
})

export function PurchaseHistoryDrawerForm({ open, onOpenChange, mode, customer, initial, onSuccess }: Props) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    getValues
  } = useForm<PurchaseHistoryForm>({
    resolver: zodResolver(schemaPurchaseHistory),
    defaultValues: toDefaultValues(customer, initial)
  })

  const { fields, append, replace } = useFieldArray({
    control,
    name: 'ownerCustomer'
  })

  const ownerCustomer = useWatch({
    control,
    name: 'ownerCustomer'
  })

  React.useEffect(() => {
    reset(toDefaultValues(customer, initial))
  }, [customer, initial, reset])

  const handleSumbit = async (payload: PurchaseHistoryForm) => {
    let res

    if (mode === 'create') {
      res = await addPurchaseHistory(payload)
    } else if (mode === 'edit' && initial?.id) {
      res = await updatePurchaseHistory(initial.id, payload)
    }

    // se por algum motivo não tiver resposta, não fecha
    if (!res) return

    // 👉 se a API respondeu erro (400, validação etc.), o addJson/updateJson
    // já mostraram o toast. Aqui a gente só NÃO fecha o drawer.
    if (!res.success) {
      return
    }

    // 👉 sucesso: se quiser passar o cliente atualizado para o pai
    if (onSuccess && res.data) {
      onSuccess(res.data)
      reset()
    }

    // 👉 só fecha se deu sucesso
    onOpenChange(false)
  }

  const normalizePercentage = (value: unknown): number => {
    const n = Number(value)
    return Number.isFinite(n) ? n : 0
  }

  const handleAddBuyer = () => {
    const current = (getValues('ownerCustomer') ?? []) as PurchaseHistoryForm['ownerCustomer']
    const count = current.length

    // Nenhum comprador ainda → cria o primeiro com 100%
    if (count === 0) {
      append({
        customer: { value: '', label: '' },
        percentage: 1
      })
      return
    }

    // Normaliza tudo pra número
    const normalized = current.map((c) => ({
      ...c,
      percentage: normalizePercentage(c?.percentage)
    }))

    const allHavePercentage = normalized.every((c) => !Number.isNaN(c.percentage))

    if (!allHavePercentage) {
      // se algo estiver estranho, só adiciona com 0 e não mexe nos outros
      append({
        customer: { value: '', label: '' },
        percentage: 0
      })
      return
    }

    const firstPerc = normalized[0]?.percentage ?? 0
    const allEqual = normalized.every((c) => Math.abs((c.percentage ?? 0) - firstPerc) < 1e-6)

    // Se todos são iguais (ex.: [1], [0.5, 0.5], [0.33, 0.33, 0.33]...)
    // ⇒ redistribui igualmente entre todos + novo
    if (allEqual) {
      const totalBuyers = count + 1
      const equalShare = 1 / totalBuyers

      const redistributed = normalized.map((c) => ({
        ...c,
        percentage: equalShare
      }))

      const newBuyer = {
        customer: { value: '', label: '' },
        percentage: equalShare
      }

      // atualiza o array inteiro de uma vez
      replace([...redistributed, newBuyer])
      return
    }

    // Se já estão diferentes (usuário personalizou),
    // não mexe em ninguém, só adiciona um novo com 0
    append({
      customer: { value: '', label: '' },
      percentage: 0
    })
  }

  const handleRemoveBuyer = (indexToRemove: number) => {
    const current = ownerCustomer ?? []

    // se por algum motivo tiver 0 ou 1, garante pelo menos 1 linha
    if (current.length <= 1) {
      replace([
        {
          customer: { value: '', label: '' },
          percentage: 1
        }
      ])
      return
    }

    const remaining = current.filter((_, idx) => idx !== indexToRemove)

    const allHavePercentage = remaining.every((c) => typeof c?.percentage === 'number' && !Number.isNaN(c.percentage))

    if (!allHavePercentage) {
      // se algo estiver estranho, só remove e mantém o resto como está
      replace(remaining as typeof current)
      return
    }

    const firstPerc = remaining[0]?.percentage ?? 0
    const allEqual = remaining.every((c) => Math.abs((c?.percentage ?? 0) - firstPerc) < 1e-6)

    // se todos os restantes têm a mesma porcentagem → redistribui = 1 / n
    if (allEqual) {
      const equalShare = 1 / remaining.length

      const redistributed = remaining.map((c) => ({
        ...c,
        percentage: equalShare
      }))

      replace(redistributed as typeof current)
      return
    }

    // se já estavam diferentes → respeita o que o usuário fez, só remove
    replace(remaining as typeof current)
  }

  // controla o dialog de delete
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deleteLoading, setDeleteLoading] = React.useState(false)

  const handleConfirmDelete = async () => {
    if (!initial?.id) return
    try {
      setDeleteLoading(true)
      const res = await deletePurchaseHistory(initial.id)

      if (!res.success) return

      if (onSuccess) {
        onSuccess(initial as ApiPurchaseHistory)
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
      <Drawer.Root open={open} onOpenChange={(details) => onOpenChange(details.open)} placement="end" size="lg">
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>{mode === 'create' ? 'Nova' : 'Editar'} compra</Drawer.Title>
              <Drawer.CloseTrigger />
            </Drawer.Header>

            <Drawer.Body>
              <Form id="purchase-history-form" hookFormHandleSubmit={handleSubmit} onSubmit={handleSumbit}>
                <Tabs.Root defaultValue="dados">
                  <Tabs.List>
                    <Tabs.Trigger value="dados">Dados</Tabs.Trigger>
                    <Tabs.Trigger value="compradores">Compradores</Tabs.Trigger>
                  </Tabs.List>

                  {/* DADOS */}
                  <Tabs.Content value="dados">
                    <Stack gap={4} mt={4}>
                      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                        <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                          <ControlledSelectAsync
                            label="Projeto"
                            name="development"
                            control={control}
                            required
                            error={errors.development?.value?.message}
                            loadOptions={async () => {
                              const res = await fetchDevelopment({})
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
                        </GridItem>
                        <ControlledCurrencyInput
                          required
                          name="amount"
                          control={control}
                          label="Valor"
                          error={errors.amount?.message}
                        />

                        <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                          <Separator flex="1" />
                          <Text flexShrink="0">Mais informações</Text>
                          <Separator flex="1" />
                        </GridItem>

                        <ControlledInput
                          required
                          name="unit"
                          control={control}
                          label="Unidade"
                          error={errors.unit?.message}
                        />
                        <ControlledInput
                          name="floorPlan"
                          control={control}
                          label="Planta"
                          error={errors.floorPlan?.message}
                          endElement="m²"
                        />
                      </Grid>
                    </Stack>
                  </Tabs.Content>

                  {/* COMPRADORES */}
                  <Tabs.Content value="compradores">
                    <Stack gap={4} mt={4}>
                      {fields.map((field, index) => (
                        <Grid
                          key={field.id}
                          templateColumns={{ base: '1fr', md: '1fr auto auto' }}
                          gap={3}
                          alignItems="flex-end"
                        >
                          <GridItem as={HStack} colSpan={{ base: 1, md: 1 }}>
                            <ControlledSelectAsync
                              width="full"
                              label={`Comprador ${fields.length === 1 ? '' : ` ${index + 1}`}`}
                              name={`ownerCustomer.${index}.customer` as const}
                              control={control}
                              isFilter
                              required
                              error={errors.ownerCustomer?.[index]?.customer?.value?.message}
                              placeholder="Selecione um cliente"
                              disabled={fields.length === 1}
                              loadOptions={async (_inputValue?: string, searchTxt?: string) => {
                                const term = (searchTxt ?? '').trim()

                                const res = await fetchCustomers({
                                  search: term || undefined,
                                  searchFields: ['name', 'email', 'phone'],
                                  page: 1,
                                  pageSize: 20
                                })

                                if (!res.success || !res.data) return []

                                const currentOwnerCustomers = ownerCustomer ?? []

                                // pega todos os IDs já selecionados, exceto o índice atual
                                const selectedIds = currentOwnerCustomers
                                  .map((oc, idx) => (idx === index ? null : oc?.customer?.value))
                                  .filter((id): id is string => Boolean(id))

                                return res.data.records
                                  .filter((c) => !selectedIds.includes(c.id))
                                  .map((c) => ({
                                    label: `${c.name} - ${c.email ?? formatPhoneForList(c.phone, true)}`,
                                    value: c.id
                                  }))
                              }}
                            />
                          </GridItem>

                          <GridItem>
                            <ControlledInputNumber
                              w={24}
                              name={`ownerCustomer.${index}.percentage` as const}
                              label="Porcent."
                              control={control}
                              min={0.01}
                              max={1}
                              required
                              isPercent
                              endElement="%"
                              error={errors.ownerCustomer?.[index]?.percentage?.message}
                              disabled={fields.length === 1}
                            />
                          </GridItem>

                          <GridItem>
                            <IconButton
                              aria-label="Excluir comprador"
                              colorPalette="red"
                              variant="outline"
                              onClick={() => handleRemoveBuyer(index)}
                              disabled={fields.length === 1}
                            >
                              <BiTrashAlt />
                            </IconButton>
                          </GridItem>
                        </Grid>
                      ))}
                      {errors.ownerCustomer?.root?.message && (
                        <Alert.Root status="error">
                          <Alert.Indicator />
                          <Alert.Title>{errors.ownerCustomer?.root?.message}</Alert.Title>
                        </Alert.Root>
                      )}

                      <Button variant="outline" onClick={handleAddBuyer}>
                        Adicionar comprador
                      </Button>
                    </Stack>
                  </Tabs.Content>
                </Tabs.Root>
              </Form>
            </Drawer.Body>
            <Drawer.Footer justifyContent={mode !== 'create' ? 'space-between' : 'end'}>
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
              <Button type="submit" form="purchase-history-form" loading={isSubmitting}>
                {mode === 'create' ? 'Salvar' : 'Atualizar'} compra
              </Button>
            </Drawer.Footer>

            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
      {mode !== 'create' && (
        <DeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          loading={deleteLoading}
          entity="histórico de compra"
          itemName={initial?.development?.name}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  )
}
