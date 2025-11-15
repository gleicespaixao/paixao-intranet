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
import { ControlledInput } from '../controlled-input/controlled-input'
import { withMask } from 'use-mask-input'
import { CompanyForm, schemaCompany } from '@/schemas/company'
import { ApiCompany } from '@/@types/api-company'
import { addCompany, updateCompany } from '@/services/company'
import { useCepAutoFill } from '@/hooks/use-cep-auto-fill'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  initial?: Partial<ApiCompany>
  onSuccess?: (company: ApiCompany) => void
}

const toDefaultValues = (c?: Partial<ApiCompany>): CompanyForm => ({
  name: c?.name ?? '',
  email: c?.email ?? '',
  phone: c?.phone ?? '',
  cnpj: c?.cnpj ?? '',
  address: {
    postalCode: c?.address?.postalCode?.replace(/\D/g, ''),
    street: c?.address?.street,
    streetNumber: c?.address?.streetNumber,
    neighborhood: c?.address?.neighborhood,
    city: c?.address?.city,
    state: c?.address?.state
  }
})

export function CompanyDrawerForm({ open, onOpenChange, mode, initial, onSuccess }: Props) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    watch,
    setValue
  } = useForm<CompanyForm>({
    resolver: zodResolver(schemaCompany),
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

  const { cepLoading, addressLocked } = useCepAutoFill<CompanyForm>({
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

  const handleSumbit = async (payload: CompanyForm) => {
    let res

    if (mode === 'create') {
      res = await addCompany(payload)
    } else if (mode === 'edit' && initial?.id) {
      res = await updateCompany(initial.id, payload)
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
            <Drawer.Title>{mode === 'create' ? 'Nova' : 'Editar'} empresa</Drawer.Title>
            <Drawer.CloseTrigger />
          </Drawer.Header>

          <Drawer.Body>
            <Form id="company-form" hookFormHandleSubmit={handleSubmit} onSubmit={handleSumbit}>
              <Tabs.Root defaultValue="dados">
                <Tabs.List>
                  <Tabs.Trigger value="dados">Dados</Tabs.Trigger>
                  <Tabs.Trigger value="endereco">Endereço</Tabs.Trigger>
                </Tabs.List>

                {/* DADOS */}
                <Tabs.Content value="dados">
                  <Stack gap={4} mt={4}>
                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                      <GridItem colSpan={{ base: 1, md: 2 }}>
                        <ControlledInput
                          required
                          name="name"
                          control={control}
                          label="Nome"
                          error={errors.name?.message}
                        />
                      </GridItem>
                      <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                        <Separator flex="1" />
                        <Text flexShrink="0">Contato</Text>
                        <Separator flex="1" />
                      </GridItem>
                      <ControlledInput name="email" control={control} label="E-mail" error={errors.email?.message} />
                      <ControlledInput
                        name="phone"
                        control={control}
                        label="Telefone"
                        error={errors.phone?.message}
                        ref={withMask(['(99) 9999-9999', '(99) 99999-9999'])}
                      />
                      <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                        <Separator flex="1" />
                        <Text flexShrink="0">Mais informações</Text>
                        <Separator flex="1" />
                      </GridItem>
                      <ControlledInput
                        required
                        name="cnpj"
                        control={control}
                        label="CNPJ"
                        error={errors.cnpj?.message}
                        ref={withMask(['99.999.999/9999-99'])}
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
              </Tabs.Root>
            </Form>
          </Drawer.Body>
          <Drawer.Footer>
            <Button type="submit" form="company-form" loading={isSubmitting}>
              {mode === 'create' ? 'Salvar' : 'Atualizar'} empresa
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
