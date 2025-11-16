import * as React from 'react'
import { Dialog, Button, Grid, CloseButton, HStack, GridItem, IconButton } from '@chakra-ui/react'
import { Form } from '@/components/form'
import { DefaultValues, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ApiCustomer } from '@/@types/api-customer'
import { ControlledSelectAsync } from '../controlled-select/controlled-select-async'
import { BiPlus } from 'react-icons/bi'
import { Tooltip } from '../ui/tooltip'
import { addCustumerCompany, fetchCompany } from '@/services/company'
import { ApiCompany } from '@/@types/api-company'
import { CompanyCustomerForm, schemaCompanyCustomer } from '@/schemas/company'
import { CompanyDrawerForm } from '../drawer/company-drawer-form'
import { formatPhoneForList } from '@/utils/phone-ddi-config'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: Partial<ApiCompany>
  customer: Partial<ApiCustomer>
  onSuccess?: (company: ApiCompany) => void
}

const toDefaultValues = (rel?: Partial<ApiCompany>): DefaultValues<CompanyCustomerForm> => {
  return {
    company: rel
      ? {
          value: rel.id,
          label: rel.name
        }
      : undefined
  }
}

export function CompanyDialogForm({ open, onOpenChange, initial, customer, onSuccess }: Props) {
  const defaultValues = React.useMemo(() => toDefaultValues(initial), [initial])

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    setValue
  } = useForm<CompanyCustomerForm>({
    resolver: zodResolver(schemaCompanyCustomer),
    defaultValues
  })

  const [customerOpen, setCustomerOpen] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      reset(defaultValues)
    }
  }, [defaultValues, reset, open])

  const onSubmit = async (payload: CompanyCustomerForm) => {
    const res = await addCustumerCompany(payload.company.value, customer.id!)

    if (!res) return
    if (!res.success) return

    if (onSuccess && res.data) {
      onSuccess(res.data)
      reset()
    }

    onOpenChange(false)
  }

  return (
    <>
      <Dialog.Root open={open} onOpenChange={(details) => onOpenChange(details.open)} size="md">
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Vincular empresa ao cliente</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>

            <Dialog.Body>
              <Form id="company-customer-form" hookFormHandleSubmit={handleSubmit} onSubmit={onSubmit}>
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                  <GridItem as={HStack} colSpan={{ base: 1, md: 2 }}>
                    <ControlledSelectAsync
                      label="Empresa"
                      name="company"
                      control={control}
                      isFilter
                      required
                      error={errors.company?.message}
                      placeholder="Selecione uma empresa"
                      loadOptions={async (_inputValue?: string, searchTxt?: string) => {
                        const term = (searchTxt ?? '').trim()

                        const res = await fetchCompany({
                          search: term || undefined,
                          searchFields: ['name', 'email', 'phone'],
                          page: 1,
                          pageSize: 20,
                          fixedFilters: [`customer.id ne ${customer?.id}`]
                        })

                        if (res.success && res.data) {
                          return res.data.records.map((c) => ({
                            label: `${c.name} - ${c.email ?? formatPhoneForList(c.phone, true)}`,
                            value: c.id
                          }))
                        }

                        return []
                      }}
                    />
                    <Tooltip content="Nova empresa" openDelay={300}>
                      <IconButton
                        mt={6}
                        aria-label="Nova empresa"
                        variant="subtle"
                        onClick={() => setCustomerOpen(true)}
                      >
                        <BiPlus />
                      </IconButton>
                    </Tooltip>
                  </GridItem>
                </Grid>
              </Form>
            </Dialog.Body>
            <Dialog.Footer>
              <Button type="submit" form="company-customer-form" loading={isSubmitting}>
                Vincular empresa
              </Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      <CompanyDrawerForm
        open={customerOpen}
        onOpenChange={setCustomerOpen}
        mode="create"
        initial={undefined}
        onSuccess={(createdCompany) => {
          setValue('company', {
            value: createdCompany.id,
            label: `${createdCompany.name} - ${createdCompany.email ?? formatPhoneForList(createdCompany.phone, true)}`
          })
        }}
      />
    </>
  )
}
