import { ApiCustomer, CustomerStatus } from '@/@types/api-customer'
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
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Stat
} from '@chakra-ui/react'

const statusToBadge = (status?: 'active' | 'inactive' | 'paused') => {
  switch (status) {
    case 'active':
      return { label: 'Ativo', colorScheme: 'green' as const }
    case 'paused':
      return { label: 'Pausado', colorScheme: 'yellow' as const }
    case 'inactive':
      return { label: 'Inativo', colorScheme: 'red' as const }
    default:
      return { label: '—', colorScheme: 'gray' as const }
  }
}

export const CustomerViewInfo = ({ customer, loading }: { customer?: ApiCustomer; loading: boolean }) => {
  const rawStatus: CustomerStatus | undefined = customer?.status
  const { label: statusLabel, colorScheme } = statusToBadge(rawStatus)
  const meta = !loading ? getMaritalStatusMeta(customer?.maritalStatus) : null

  const stats =
    !loading && customer
      ? [
          {
            label: 'Status',
            value: <Badge colorPalette={colorScheme}>{statusLabel}</Badge>
          },
          { label: 'E-mail', value: customer.email },
          { label: 'Telefone', value: formatPhoneNumber(customer.phone) },
          { label: 'Data de nasc.', value: formatDateShort(customer.dateBirth) },
          { label: 'RG', value: customer.rg },
          { label: 'CPF', value: formatCPF(customer.cpf) },
          { label: 'Profissão', value: customer.profession },
          {
            label: 'Estado civil',
            value: <Badge colorPalette={meta?.colorPalette}>{meta?.label}</Badge>
          }
        ]
      : // placeholders enquanto carrega
        [
          { label: 'Status', value: <Skeleton h="4" w="64px" /> },
          { label: 'E-mail', value: <Skeleton h="4" w="200px" /> },
          { label: 'Telefone', value: <Skeleton h="4" w="160px" /> },
          { label: 'Data de nasc.', value: <Skeleton h="4" w="120px" /> },
          { label: 'RG', value: <Skeleton h="4" w="120px" /> },
          { label: 'CPF', value: <Skeleton h="4" w="160px" /> },
          { label: 'Profissão', value: <Skeleton h="4" w="160px" /> },
          { label: 'Estado civil', value: <Skeleton h="4" w="120px" /> }
        ]

  return (
    <Stack>
      <Card.Root>
        <Card.Body gap="0" alignItems="center">
          <Avatar.Root size="2xl">
            {loading ? <SkeletonCircle size="16" /> : <Avatar.Fallback name={customer?.name ?? ''} />}
          </Avatar.Root>

          {loading ? (
            <Stack>
              <SkeletonText noOfLines={1} w="48" mt="4" />
              <SkeletonText noOfLines={1} w="36" mt="1" />
            </Stack>
          ) : (
            <>
              <Card.Title mt="2">{customer?.name}</Card.Title>
              <Card.Description>ID do cliente: {customer?.token}</Card.Description>
            </>
          )}

          <HStack mt="6" w="full" justify="center">
            <Stat.Root borderWidth="1px" minW="40" gap={0} p="4" rounded="md">
              <Stat.ValueText fontSize="lg">
                {loading ? (
                  <Skeleton h="6" w="32" mb="2" />
                ) : (
                  <LocaleProvider locale="pt-BR">
                    <FormatNumber value={214532} style="currency" currency="BRL" />
                  </LocaleProvider>
                )}
              </Stat.ValueText>
              <Stat.Label>Ticket médio</Stat.Label>
            </Stat.Root>

            <Stat.Root borderWidth="1px" minW="40" gap={0} p="4" rounded="md">
              <Stat.ValueText fontSize="lg">
                {loading ? (
                  <Skeleton h="6" w="32" mb="2" />
                ) : (
                  <LocaleProvider locale="pt-BR">
                    <FormatNumber value={192523} style="currency" currency="BRL" />
                  </LocaleProvider>
                )}
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

            <Button disabled={loading}>Editar cliente</Button>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Stack>
  )
}
