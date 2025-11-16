import { ApiCustomer } from '@/@types/api-customer'
import { CustomerDrawerForm } from '@/components/drawer/customer-drawer-form'
import { getCustomerStatusMeta } from '@/utils/customer-status'
import { formatDateShort } from '@/utils/date-converter'
import { formatCPF } from '@/utils/format-doc'
import { formatPhoneNumber } from '@/utils/format-phone-number'
import { getMaritalStatusMeta } from '@/utils/marital-status'
import {
  Avatar,
  Badge,
  Button,
  Card,
  DataList,
  FormatNumber,
  Heading,
  HStack,
  LocaleProvider,
  Separator,
  Stack,
  Stat
} from '@chakra-ui/react'
import React from 'react'

export const CustomerViewInfo = ({
  customer,
  onCustomerChange
}: {
  customer: ApiCustomer
  onCustomerChange?: (customer: ApiCustomer) => void
}) => {
  const meta = getMaritalStatusMeta(customer?.maritalStatus)

  const { label, colorPalette } = getCustomerStatusMeta(customer?.status)

  const stats = [
    {
      label: 'Status',
      value: <Badge colorPalette={colorPalette}>{label}</Badge>
    },
    { label: 'E-mail', value: customer.email },
    { label: 'Telefone', value: formatPhoneNumber(customer.phone) },
    {
      label: 'Data de nasc.',
      value: customer?.dateBirth !== '0001-01-01' ? formatDateShort(customer.dateBirth) : null
    },
    { label: 'RG', value: customer.rg },
    { label: 'CPF', value: formatCPF(customer.cpf) },
    { label: 'Profissão', value: customer.profession },
    {
      label: 'Estado civil',
      value: <Badge colorPalette={meta?.colorPalette}>{meta?.label}</Badge>
    }
  ]
  const [open, setOpen] = React.useState(false)

  return (
    <Stack>
      <Card.Root>
        <Card.Body gap="0" alignItems="center">
          <Avatar.Root size="2xl">
            <Avatar.Fallback name={customer?.name ?? ''} />
          </Avatar.Root>

          <Card.Title mt="2">{customer?.name}</Card.Title>
          <Card.Description>ID do cliente: {customer?.token}</Card.Description>

          <HStack mt="6" w="full" justify="center">
            <Stat.Root borderWidth="1px" minW="40" gap={0} p="4" rounded="md">
              <Stat.ValueText fontSize="lg">
                <LocaleProvider locale="pt-BR">
                  <FormatNumber value={customer.ticketAverage} style="currency" currency="BRL" />
                </LocaleProvider>
              </Stat.ValueText>
              <Stat.Label>Ticket médio</Stat.Label>
            </Stat.Root>

            <Stat.Root borderWidth="1px" minW="40" gap={0} p="4" rounded="md">
              <Stat.ValueText fontSize="lg">
                <LocaleProvider locale="pt-BR">
                  <FormatNumber value={customer.lastPurchaseAmount} style="currency" currency="BRL" />
                </LocaleProvider>
              </Stat.ValueText>
              <Stat.Label>Última compra</Stat.Label>
            </Stat.Root>
          </HStack>

          <Stack w="full" pt="6" gap="4">
            <Heading fontSize="lg">Detalhes</Heading>
            <Separator />

            <DataList.Root orientation="horizontal">
              {stats.map((item) => (
                <DataList.Item key={item.label}>
                  <DataList.ItemLabel>{item.label}:</DataList.ItemLabel>
                  <DataList.ItemValue>{item.value}</DataList.ItemValue>
                </DataList.Item>
              ))}
            </DataList.Root>

            <Button onClick={() => setOpen(true)}>Editar cliente</Button>
          </Stack>
        </Card.Body>
      </Card.Root>
      <CustomerDrawerForm
        open={open}
        onOpenChange={setOpen}
        mode="edit"
        initial={customer}
        onSuccess={(updatedCustomer) => {
          // atualiza em quem chamou esse componente (página)
          onCustomerChange?.(updatedCustomer)
          // fecha o drawer (se o próprio drawer já fechar, isso é redundante mas inofensivo)
          setOpen(false)
        }}
      />
    </Stack>
  )
}
