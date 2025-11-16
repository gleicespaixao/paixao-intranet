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
  Spinner
} from '@chakra-ui/react'
import { Form } from '@/components/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { schemaCustomer, type CustomerForm } from '@/schemas/customer'
import type { ApiCustomer } from '@/@types/api-customer'
import { ControlledInput } from '../controlled-input/controlled-input'
import { withMask } from 'use-mask-input'
import { ControlledInputDate } from '../controlled-input/date'
import { ControlledSelect } from '../controlled-select/controlled-select'
import { MARITAL_STATUS_OPTIONS } from '@/utils/marital-status'
import { PURCHASE_GOALS_MAP, PURCHASE_GOALS_OPTIONS, PurchaseGoals } from '@/utils/purchase-goals'
import { ControlledSelectAsync } from '../controlled-select/controlled-select-async'
import { fetchTypeOfProperty } from '@/services/type-of-property'
import { fetchNeighborhood } from '@/services/neighborhood'
import { Bedroom, BEDROOM_MAP, BEDROOM_OPTIONS } from '@/utils/bedroom'
import { addCustomer, updateCustomer } from '@/services/customer'
import { Garage, GARAGE_MAP, GARAGE_OPTIONS } from '@/utils/garage'
import { useCepAutoFill } from '@/hooks/use-cep-auto-fill'
import { CUSTOMER_STATUS_OPTIONS } from '@/utils/customer-status'
import { ControlledPhone } from '../controlled-input/controlled-phone-input'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  initial?: Partial<ApiCustomer>
  onSuccess?: (customer: ApiCustomer) => void
}

const toDefaultValues = (c?: Partial<ApiCustomer>): CustomerForm => ({
  status: c?.status ?? 'active',
  name: c?.name ?? '',
  email: c?.email ?? '',
  rg: c?.rg ?? '',
  cpf: c?.cpf ?? '',
  dateBirth: c?.dateBirth && c?.dateBirth !== '0001-01-01' ? new Date(c?.dateBirth + 'T12:00:00') : null,
  phone: c?.phone ?? '',
  profession: c?.profession ?? '',
  maritalStatus: c?.maritalStatus ?? 'single',
  address: {
    postalCode: c?.address?.postalCode?.replace(/\D/g, ''),
    street: c?.address?.street,
    streetNumber: c?.address?.streetNumber,
    neighborhood: c?.address?.neighborhood,
    city: c?.address?.city,
    state: c?.address?.state
  },
  propertyProfile: {
    purchaseGoals: c?.propertyProfile?.purchaseGoals
      ? c.propertyProfile.purchaseGoals
          .filter((goal): goal is PurchaseGoals => goal !== 'none')
          .map((goal) => ({
            value: goal,
            label: PURCHASE_GOALS_MAP[goal].label
          }))
      : [],
    neighborhood: c?.propertyProfile?.neighborhood
      ? c?.propertyProfile?.neighborhood.map((neighborhood) => ({
          value: neighborhood.id,
          label: neighborhood.name
        }))
      : [],
    typeOfProperty: c?.propertyProfile?.typeOfProperty
      ? c?.propertyProfile?.typeOfProperty.map((typeOfProperty) => ({
          value: typeOfProperty.id,
          label: typeOfProperty.name
        }))
      : [],
    bedrooms: c?.propertyProfile?.bedrooms
      ? c.propertyProfile.bedrooms
          .filter((bedroom): bedroom is Bedroom => bedroom !== 'none')
          .map((bedroom) => ({
            value: bedroom,
            label: BEDROOM_MAP[bedroom].label
          }))
      : [],
    garage: c?.propertyProfile?.garage
      ? c.propertyProfile.garage
          .filter((garage): garage is Garage => garage !== 'none')
          .map((garage) => ({
            value: garage,
            label: GARAGE_MAP[garage].label
          }))
      : []
  }
})

export function CustomerDrawerForm({ open, onOpenChange, mode, initial, onSuccess }: Props) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    watch,
    setValue
  } = useForm<CustomerForm>({
    resolver: zodResolver(schemaCustomer),
    defaultValues: toDefaultValues(initial)
  })
  const hasInitialAddress =
    !!initial?.address &&
    !!(
      initial.address.postalCode ||
      initial.address.street ||
      initial.address.streetNumber ||
      initial.address.neighborhood ||
      initial.address.city ||
      initial.address.state
    )

  const { cepLoading, addressLocked } = useCepAutoFill<CustomerForm>({
    watch,
    setValue,
    hasInitialAddress,
    fields: {
      postalCode: 'address.postalCode',
      street: 'address.street',
      neighborhood: 'address.neighborhood',
      city: 'address.city',
      state: 'address.state',
      streetNumber: 'address.streetNumber',
      addressLine: 'address.addressLine'
    }
  })

  React.useEffect(() => {
    reset(toDefaultValues(initial))
  }, [initial, reset])

  const handleSumbit = async (payload: CustomerForm) => {
    let res

    if (mode === 'create') {
      res = await addCustomer(payload)
    } else if (mode === 'edit' && initial?.id) {
      res = await updateCustomer(initial.id, payload)
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

  return (
    <Drawer.Root open={open} onOpenChange={(details) => onOpenChange(details.open)} placement="end" size="lg">
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>{mode === 'create' ? 'Novo' : 'Editar'} cliente</Drawer.Title>
            <Drawer.CloseTrigger />
          </Drawer.Header>

          <Drawer.Body>
            <Form id="customer-form" hookFormHandleSubmit={handleSubmit} onSubmit={handleSumbit}>
              <Tabs.Root defaultValue="dados">
                <Tabs.List>
                  <Tabs.Trigger value="dados">Dados</Tabs.Trigger>
                  <Tabs.Trigger value="endereco">Endereço</Tabs.Trigger>
                  <Tabs.Trigger value="perfil">Perfil de compra</Tabs.Trigger>
                </Tabs.List>

                {/* DADOS */}
                <Tabs.Content value="dados">
                  <Stack gap={4} mt={4}>
                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                      <ControlledSelect
                        name="status"
                        control={control}
                        label="Status"
                        error={errors.status?.message}
                        items={CUSTOMER_STATUS_OPTIONS}
                      />
                      <ControlledSelect
                        name="maritalStatus"
                        control={control}
                        label="Estado civil"
                        error={errors.maritalStatus?.message}
                        items={MARITAL_STATUS_OPTIONS}
                      />

                      <GridItem colSpan={{ base: 1, md: 2 }}>
                        <ControlledInput
                          required
                          name="name"
                          control={control}
                          label="Nome"
                          error={errors.name?.message}
                        />
                      </GridItem>
                      <ControlledInputDate
                        name="dateBirth"
                        control={control}
                        label="Data de nascimento"
                        error={errors.dateBirth?.message}
                        disablePortal
                      />
                      <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                        <Separator flex="1" />
                        <Text flexShrink="0">Contato</Text>
                        <Separator flex="1" />
                      </GridItem>
                      <ControlledInput name="email" control={control} label="E-mail" error={errors.email?.message} />
                      <ControlledPhone
                        control={control}
                        name="phone"
                        label="Telefone"
                        error={errors.phone?.message}
                        required
                      />
                      <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                        <Separator flex="1" />
                        <Text flexShrink="0">Mais informações</Text>
                        <Separator flex="1" />
                      </GridItem>
                      <ControlledInput
                        name="cpf"
                        control={control}
                        label="CPF"
                        error={errors.cpf?.message}
                        ref={withMask(['999.999.999-99'])}
                      />
                      <ControlledInput name="rg" control={control} label="RG" error={errors.rg?.message} />
                      <ControlledInput
                        name="profession"
                        control={control}
                        label="Profissão"
                        error={errors.profession?.message}
                      />
                    </Grid>
                  </Stack>
                </Tabs.Content>

                {/* ENDEREÇO */}
                <Tabs.Content value="endereco">
                  <Stack gap={4} mt={4}>
                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                      <ControlledInput
                        name="address.postalCode"
                        control={control}
                        label="CEP"
                        error={errors.address?.postalCode?.message}
                        ref={withMask(['99999-999'])}
                        placeholder="Ex.: 05410001"
                      />
                      {cepLoading && <Spinner mt={9} size="sm" />}
                      <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                        <ControlledInput
                          name="address.street"
                          control={control}
                          label="Rua / Avenida"
                          error={errors.address?.street?.message}
                          placeholder="Ex.: Avenida los Leones"
                          disabled={addressLocked}
                        />
                        <ControlledInput
                          name="address.streetNumber"
                          control={control}
                          label="Número"
                          error={errors.address?.streetNumber?.message}
                          placeholder="Ex.: 4563"
                          disabled={addressLocked}
                        />
                      </GridItem>

                      <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                        <ControlledInput
                          name="address.addressLine"
                          control={control}
                          label="Complemento"
                          error={errors.address?.addressLine?.message}
                          placeholder="Ex.: Casa 3"
                          disabled={addressLocked}
                        />
                      </GridItem>
                      <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                        <ControlledInput
                          name="address.neighborhood"
                          control={control}
                          label="Bairro"
                          error={errors.address?.neighborhood?.message}
                          disabled={addressLocked}
                        />
                        <ControlledInput
                          name="address.city"
                          control={control}
                          label="Cidade"
                          error={errors.address?.city?.message}
                          disabled={addressLocked}
                        />
                        <ControlledInput
                          name="address.state"
                          control={control}
                          label="Estado"
                          error={errors.address?.state?.message}
                          disabled={addressLocked}
                        />
                      </GridItem>
                    </Grid>
                  </Stack>
                </Tabs.Content>

                {/* PERFIL DO IMÓVEL */}
                <Tabs.Content value="perfil">
                  <Stack gap={4} mt={4}>
                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                      <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                        <ControlledSelectAsync
                          label="Objetivo da compra"
                          name="propertyProfile.purchaseGoals"
                          control={control}
                          multiple
                          error={errors.propertyProfile?.purchaseGoals?.message}
                          loadOptions={async () => PURCHASE_GOALS_OPTIONS.filter((opt) => opt.value !== 'none')}
                        />
                      </GridItem>
                      <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                        <ControlledSelectAsync
                          label="Tipo"
                          name="propertyProfile.typeOfProperty"
                          control={control}
                          multiple
                          error={errors.propertyProfile?.typeOfProperty?.message}
                          loadOptions={async () => {
                            const res = await fetchTypeOfProperty({})
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
                      <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                        <ControlledSelectAsync
                          label="Bairros"
                          name="propertyProfile.neighborhood"
                          control={control}
                          multiple
                          error={errors.propertyProfile?.neighborhood?.message}
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
                      </GridItem>

                      <ControlledSelectAsync
                        label="Dormitórios"
                        name="propertyProfile.bedrooms"
                        control={control}
                        multiple
                        error={errors.propertyProfile?.bedrooms?.message}
                        loadOptions={async () => BEDROOM_OPTIONS.filter((opt) => opt.value !== 'none')}
                      />
                      <ControlledSelectAsync
                        label="Garagem"
                        name="propertyProfile.garage"
                        control={control}
                        multiple
                        error={errors.propertyProfile?.garage?.message}
                        loadOptions={async () => GARAGE_OPTIONS.filter((opt) => opt.value !== 'none')}
                      />
                    </Grid>
                  </Stack>
                </Tabs.Content>
              </Tabs.Root>
            </Form>
          </Drawer.Body>
          <Drawer.Footer>
            <Button type="submit" form="customer-form" loading={isSubmitting}>
              {mode === 'create' ? 'Salvar' : 'Atualizar'} cliente
            </Button>
          </Drawer.Footer>

          <Drawer.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Drawer.CloseTrigger>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  )
}
