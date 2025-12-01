import { ControlledInput } from '@/components/controlled-input/controlled-input'
import { useCepAutoFill } from '@/hooks/use-cep-auto-fill'
import { DevelopmentForm } from '@/schemas/development'
import { Card, Grid, GridItem, Heading, HStack, Spinner, Stack } from '@chakra-ui/react'
import { Control, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { withMask } from 'use-mask-input'

type Props = {
  watch: UseFormWatch<DevelopmentForm>
  setValue: UseFormSetValue<DevelopmentForm>
  hasInitialAddress: boolean
  control: Control<DevelopmentForm>
  errors: FieldErrors<DevelopmentForm>
}

export function DevelopmentViewAddress({ watch, setValue, hasInitialAddress, control, errors }: Props) {
  const { cepLoading, addressLocked } = useCepAutoFill<DevelopmentForm>({
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
  return (
    <Card.Root>
      <Card.Body>
        <Heading size="md" fontWeight="medium">
          Endereço
        </Heading>

        <Stack gap={4} mt={4}>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
            <ControlledInput
              name="address.postalCode"
              control={control}
              label="CEP"
              required
              error={errors.address?.postalCode?.message}
              ref={withMask(['99999-999'])}
              placeholder="Ex.: 05410-001"
            />
            {cepLoading && <Spinner mt={9} size="sm" />}
            <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
              <ControlledInput
                name="address.street"
                control={control}
                label="Rua / Avenida"
                required
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
                required
                error={errors.address?.neighborhood?.message}
                disabled={addressLocked}
              />
              <ControlledInput
                name="address.city"
                control={control}
                label="Cidade"
                required
                error={errors.address?.city?.message}
                disabled={addressLocked}
              />
              <ControlledInput
                name="address.state"
                control={control}
                label="Estado"
                required
                error={errors.address?.state?.message}
                disabled={addressLocked}
              />
            </GridItem>
          </Grid>
        </Stack>
      </Card.Body>
    </Card.Root>
  )
}
